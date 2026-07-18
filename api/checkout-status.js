/* global process */

const sanitize = (value, limit = 180) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, limit);
};

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

    const sessionId = sanitize(payload.sessionId, 120);
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!sessionId) {
      return Response.json({ error: "Checkout session ID is required." }, { status: 400 });
    }

    if (!stripeSecretKey) {
      return Response.json(
        { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel." },
        { status: 500 }
      );
    }

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
        },
      }
    );

    const stripePayload = await stripeResponse.json().catch(() => ({}));

    if (!stripeResponse.ok) {
      return Response.json(
        {
          error:
            stripePayload?.error?.message ||
            "Stripe payment status could not be retrieved right now.",
        },
        { status: 502 }
      );
    }

    if (stripePayload.payment_status !== "paid") {
      return Response.json(
        {
          status: stripePayload.payment_status || "pending",
          error: "Payment is not marked as paid yet.",
        },
        { status: 409 }
      );
    }

    const metadata = stripePayload.metadata || {};

    return Response.json(
      {
        status: "paid",
        message: "Payment confirmed successfully.",
        customerEmail: stripePayload.customer_details?.email || stripePayload.customer_email || "",
        playerName: metadata.player_name || "the registered player",
        section: metadata.section || "",
        serviceLevel: metadata.service_level || "",
        amountTotal:
          typeof stripePayload.amount_total === "number"
            ? stripePayload.amount_total / 100
            : null,
      },
      { status: 200 }
    );
  },
};
