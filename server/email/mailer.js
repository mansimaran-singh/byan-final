import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL || user;

  if (!host || !user || !pass) {
    console.log("[MAILER] SMTP not configured. To:", to, "Subject:", subject);
    return { sent: false, info: "smtp_not_configured" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    return { sent: true, info };
  } catch (err) {
    console.error("[MAILER] sendMail error:", err?.message || err);
    return { sent: false, info: err?.message || "send_failed" };
  }
}
