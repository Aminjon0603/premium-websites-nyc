const fallbackRecipient = "amin2002abrorov@gmail.com";

const sanitize = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\r\n/g, "\n").slice(0, 4000);
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatMultiline = (value) => escapeHtml(value || "-").replaceAll("\n", "<br />");

const buildHtml = (data) => `
  <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h1 style="margin: 0 0 16px; font-size: 22px;">New website request from ${escapeHtml(
      data.businessName || "Site by Amin form"
    )}</h1>
    <p style="margin: 0 0 18px; color: #475467;">
      A new inquiry was submitted through the Site by Amin contact form.
    </p>
    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      <tbody>
        ${[
          ["Business name", data.businessName],
          ["Website type", data.websiteType],
          ["Current website", data.currentWebsite],
          ["Social media", data.socialLink],
          ["Services", data.services],
          ["Preferred package", data.preferredPackage],
          ["Timeline", data.timeline],
          ["Email", data.email],
          ["Phone", data.phone],
          ["Notes", data.notes],
        ]
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding: 10px 0; width: 170px; vertical-align: top; font-weight: 700; border-top: 1px solid #e5e7eb;">
                  ${label}
                </td>
                <td style="padding: 10px 0; border-top: 1px solid #e5e7eb; color: #475467;">
                  ${formatMultiline(value)}
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  </div>
`;

const buildText = (data) =>
  [
    `New website request from ${data.businessName || "Site by Amin form"}`,
    "",
    `Business name: ${data.businessName || "-"}`,
    `Website type: ${data.websiteType || "-"}`,
    `Current website: ${data.currentWebsite || "-"}`,
    `Social media: ${data.socialLink || "-"}`,
    `Services: ${data.services || "-"}`,
    `Preferred package: ${data.preferredPackage || "-"}`,
    `Timeline: ${data.timeline || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    "",
    "Notes:",
    data.notes || "-",
  ].join("\n");

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
      businessName: sanitize(payload.businessName),
      websiteType: sanitize(payload.websiteType),
      currentWebsite: sanitize(payload.currentWebsite),
      socialLink: sanitize(payload.socialLink),
      services: sanitize(payload.services),
      preferredPackage: sanitize(payload.preferredPackage),
      timeline: sanitize(payload.timeline),
      email: sanitize(payload.email),
      phone: sanitize(payload.phone),
      notes: sanitize(payload.notes),
    };

    if (!data.businessName || !data.websiteType || !data.email) {
      return Response.json(
        { error: "Please fill in your business name, website type, and email." },
        { status: 400 }
      );
    }

    const env = globalThis.process?.env ?? {};
    const apiKey = env.RESEND_API_KEY;
    const fromEmail = env.CONTACT_FROM_EMAIL;
    const toEmail = env.CONTACT_TO_EMAIL || fallbackRecipient;

    if (!apiKey || !fromEmail) {
      return Response.json(
        {
          error:
            "The contact form is not configured yet. Please use email or message for now, or add RESEND_API_KEY and CONTACT_FROM_EMAIL in Vercel.",
        },
        { status: 500 }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "sitebyamin.com/1.0",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `New website request - ${data.businessName}`,
        html: buildHtml(data),
        text: buildText(data),
        headers: data.email
          ? {
              "Reply-To": data.email,
            }
          : undefined,
      }),
    });

    if (!resendResponse.ok) {
      return Response.json(
        {
          error:
            "The form could not be delivered right now. Please send an email or WhatsApp message instead.",
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        message:
          "Thanks. Your request is in. I will reply by email or message after reviewing it.",
      },
      { status: 200 }
    );
  },
};
