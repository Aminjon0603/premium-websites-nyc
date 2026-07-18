/* global process */

const fallbackRecipients = [
  "ikrom.chess@gmail.com",
  "alexnorth615@gmail.com",
  "andrea.lamanna1@gmail.com",
];

const serviceLevels = {
  entry: { label: "Tournament Entry", amount: 5500 },
  "entry-dojo": { label: "Tournament Entry + Master Training Dojo", amount: 15500 },
};

const sanitize = (value, limit = 200) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\r\n/g, "\n").slice(0, limit);
};

const splitAdditionalEmails = (value) =>
  value
    .split(/[,\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const getBaseUrl = (request) => {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }

  return request.headers.get("origin") || url.origin;
};

const buildMetadata = (data, serviceLevel) => ({
  contact_name: `${data.firstName} ${data.lastName}`.trim().slice(0, 120),
  contact_email: data.email.slice(0, 180),
  player_name: `${data.playerFirstName} ${data.playerLastName}`.trim().slice(0, 120),
  section: data.section.slice(0, 32),
  service_level: serviceLevel.label.slice(0, 120),
  parent_name: data.parentName.slice(0, 120),
  parent_email: data.parentEmail.slice(0, 180),
  parent_phone: data.parentPhone.slice(0, 80),
  emergency_name: data.emergencyName.slice(0, 120),
  emergency_phone: data.emergencyPhone.slice(0, 80),
  grade: data.playerGrade.slice(0, 32),
  school_name: data.schoolName.slice(0, 120),
  uscf_id: data.uscfId.slice(0, 60),
  additional_emails: data.additionalEmails.slice(0, 300),
  medical_info: data.medicalInfo.slice(0, 450),
});

export const runtime = "nodejs";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed." }, { status: 405 });
    }

    let payload;

    try {
      payload = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const data = {
      firstName: sanitize(payload.firstName, 120),
      lastName: sanitize(payload.lastName, 120),
      phone: sanitize(payload.phone, 80),
      email: sanitize(payload.email, 180),
      additionalEmails: splitAdditionalEmails(sanitize(payload.additionalEmails, 400)).join(", "),
      acceptSms: Boolean(payload.acceptSms),
      playerFirstName: sanitize(payload.playerFirstName, 120),
      playerLastName: sanitize(payload.playerLastName, 120),
      playerGrade: sanitize(payload.playerGrade, 32),
      schoolName: sanitize(payload.schoolName, 120),
      section: sanitize(payload.section, 32),
      serviceLevel: sanitize(payload.serviceLevel, 32),
      uscfId: sanitize(payload.uscfId, 60),
      parentName: sanitize(payload.parentName, 120),
      parentEmail: sanitize(payload.parentEmail, 180),
      parentPhone: sanitize(payload.parentPhone, 80),
      emergencyName: sanitize(payload.emergencyName, 120),
      emergencyPhone: sanitize(payload.emergencyPhone, 80),
      medicalInfo: sanitize(payload.medicalInfo, 800),
    };

    if (
      !data.firstName ||
      !data.lastName ||
      !data.phone ||
      !data.email ||
      !data.playerFirstName ||
      !data.playerLastName ||
      !data.playerGrade ||
      !data.section ||
      !data.serviceLevel ||
      !data.parentName ||
      !data.parentEmail ||
      !data.parentPhone ||
      !data.emergencyName ||
      !data.emergencyPhone ||
      !data.medicalInfo
    ) {
      return Response.json(
        { error: "Please complete all required registration fields before payment." },
        { status: 400 }
      );
    }

    if (!data.acceptSms) {
      return Response.json(
        { error: "You must accept the terms before continuing to payment." },
        { status: 400 }
      );
    }

    if (data.section === "Open" && !data.uscfId) {
      return Response.json(
        { error: "USCF ID is required for players registering in the Open section." },
        { status: 400 }
      );
    }

    const serviceLevel = serviceLevels[data.serviceLevel];

    if (!serviceLevel) {
      return Response.json({ error: "Please choose a valid service level." }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return Response.json(
        {
          error:
            "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel before using the payment flow.",
        },
        { status: 500 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const toEmails = (process.env.CONTACT_TO_EMAILS || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const recipients = toEmails.length ? toEmails : fallbackRecipients;

    if (resendApiKey && fromEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "chessandtruck.com/1.0",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: recipients,
          subject: `Registration started - ${data.playerFirstName} ${data.playerLastName}`,
          text: [
            "A family completed the tournament form and was sent to Stripe checkout.",
            `Player: ${data.playerFirstName} ${data.playerLastName}`,
            `Section: ${data.section}`,
            `Service level: ${serviceLevel.label}`,
            `Parent email: ${data.parentEmail}`,
            "Payment confirmation should be checked in Stripe.",
          ].join("\n"),
          headers: {
            "Reply-To": data.parentEmail || data.email,
          },
        }),
      }).catch(() => null);
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${getBaseUrl(request)}/?payment=success&session_id={CHECKOUT_SESSION_ID}#register`);
    params.set("cancel_url", `${getBaseUrl(request)}/?payment=cancel#register`);
    params.set("customer_email", data.parentEmail || data.email);
    params.set("allow_promotion_codes", "true");
    params.set("billing_address_collection", "auto");
    params.set("phone_number_collection[enabled]", "true");
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][unit_amount]", String(serviceLevel.amount));
    params.set("line_items[0][price_data][product_data][name]", "Chess & Truck Tournament");
    params.set(
      "line_items[0][price_data][product_data][description]",
      `${serviceLevel.label} | ${data.section} section`
    );

    Object.entries(buildMetadata(data, serviceLevel)).forEach(([key, value]) => {
      if (value) {
        params.set(`metadata[${key}]`, value);
      }
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const stripePayload = await stripeResponse.json().catch(() => ({}));

    if (!stripeResponse.ok || !stripePayload.url) {
      return Response.json(
        {
          error:
            stripePayload?.error?.message ||
            "Stripe checkout could not be created right now. Please try again.",
        },
        { status: 502 }
      );
    }

    return Response.json({ url: stripePayload.url }, { status: 200 });
  },
};
