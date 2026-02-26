import { createOTP, verifyOTP } from "./otpStore.js";
import { sendEmail } from "../email/mailer.js";

// lightweight in-memory metrics for visibility
let metrics = {
  requests: 0,
  emailsSent: 0,
  emailsFailed: 0,
  verifyOk: 0,
  verifyFail: 0,
};

export async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    metrics.requests += 1;
    const { code, expires } = createOTP(email);

    const mail = await sendEmail({
      to: email,
      subject: "BYAN Recruiter Email Verification",
      html: `<div style="font-family:system-ui,sans-serif">
        <h2>BYAN Email Verification</h2>
        <p>Your verification code is:</p>
        <div style="font-size:24px;font-weight:700;letter-spacing:6px">${code}</div>
        <p>This code expires in 3 minutes.</p>
      </div>`
    });
    if (mail.sent) metrics.emailsSent += 1; else metrics.emailsFailed += 1;

    return res.json({ ok: true, sent: mail.sent, expires });
  } catch (err) {
    console.error("requestOtp error", err);
    return res.status(500).json({ error: "server_error" });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || !code) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    const result = verifyOTP(email, String(code));
    if (result.ok) metrics.verifyOk += 1; else metrics.verifyFail += 1;
    return res.json({ ok: result.ok, reason: result.reason });
  } catch (err) {
    console.error("verifyOtp error", err);
    return res.status(500).json({ error: "server_error" });
  }
}

export function getOtpMetrics(req, res) {
  res.json({
    ...metrics,
    // basic derived rates
    successRate: metrics.verifyOk + metrics.verifyFail === 0 ? 0 : Number((metrics.verifyOk / (metrics.verifyOk + metrics.verifyFail)).toFixed(2)),
  });
}
