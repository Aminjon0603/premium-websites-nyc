/* global process */

const fallbackRecipients = [
  "ikrom.chess@gmail.com",
  "alexnorth615@gmail.com",
  "andrea.lamanna1@gmail.com",
];

const sanitize = (value, limit = 2000) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\r\n/g, "\n").slice(0, limit);
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
  <div style="font-family: Arial, sans-serif; color: #181411; line-height: 1.6;">
    <h1 style="margin: 0 0 16px; font-size: 22px;">New CHESS AND TRUCK message</h1>
    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      <tbody>
        ${[
          ["Name", data.name],
          ["Email", data.email],
          ["Phone", data.phone],
          ["Message", data.message],
        ]
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding: 10px 0; width: 140px; vertical-align: top; font-weight: 700; border-top: 1px solid #e7dfd4;">
                  ${label}
                </td>
                <td style="padding: 10px 0; color: #5f5347; border-top: 1px solid #e7dfd4;">
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
    "New CHESS AND TRUCK message",
    "",
    `Name: ${data.name || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    "",
    "Message:",
    data.message || "-",
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
      name: sanitize(payload.name, 120),
      email: sanitize(payload.email, 180),
      phone: sanitize(payload.phone, 80),
      message: sanitize(payload.message, 4000),
    };

    if (!data.name || !data.email || !data.message) {
      return Response.json(
        { error: "Please fill in your name, email, and message." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const toEmails = (process.env.CONTACT_TO_EMAILS || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const recipients = toEmails.length ? toEmails : fallbackRecipients;

    if (!apiKey || !fromEmail) {
      return Response.json(
        {
          error:
            "The contact form is not configured yet. Add RESEND_API_KEY and CONTACT_FROM_EMAIL in Vercel to enable delivery.",
        },
        { status: 500 }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "chessandtruck.com/1.0",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject: `New CHESS AND TRUCK inquiry - ${data.name}`,
        html: buildHtml(data),
        text: buildText(data),
        headers: {
          "Reply-To": data.email,
        },
      }),
    });

    if (!resendResponse.ok) {
      return Response.json(
        {
          error:
            "The message could not be delivered right now. Please email the tournament team directly instead.",
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        message: "Thanks. Your message was sent to the tournament team.",
      },
      { status: 200 }
    );
  },
};
