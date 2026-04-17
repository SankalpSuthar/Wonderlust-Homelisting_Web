// utils/sendEmail.js
const nodemailer = require("nodemailer");

function hasBrevoConfig() {
  return [
    process.env.BREVO_SMTP_SERVER,
    process.env.BREVO_SMTP_PORT,
    process.env.BREVO_SMTP_LOGIN,
    process.env.BREVO_SMTP_PASSWORD,
    process.env.BREVO_EMAIL_FROM,
  ].every(Boolean);
}

function getFriendlyEmailError(err) {
  const code = err?.code || err?.responseCode;

  if (code === "EAUTH" || code === 535) {
    return "SMTP authentication failed. Check BREVO_SMTP_LOGIN and BREVO_SMTP_PASSWORD.";
  }
  if (code === "ECONNECTION" || code === "ETIMEDOUT" || code === "ESOCKET") {
    return "SMTP connection failed. Check BREVO_SMTP_SERVER, BREVO_SMTP_PORT, and internet access.";
  }
  if (code === 550 || code === 553 || code === "EENVELOPE") {
    return "Sender/recipient address was rejected. Check BREVO_EMAIL_FROM and target email.";
  }

  return err?.message || "Unknown email transport error.";
}

async function sendEmail(to, subject, html) {
  try {
    const smtpConfigured = hasBrevoConfig();
    const isProduction = process.env.NODE_ENV === "production";

    if (!smtpConfigured && isProduction) {
      throw new Error(
        "Email service not configured. Add BREVO_SMTP_SERVER, BREVO_SMTP_PORT, BREVO_SMTP_LOGIN, BREVO_SMTP_PASSWORD, and BREVO_EMAIL_FROM."
      );
    }

    const transporter = smtpConfigured
      ? nodemailer.createTransport({
          host: process.env.BREVO_SMTP_SERVER,
          port: Number(process.env.BREVO_SMTP_PORT),
          secure: Number(process.env.BREVO_SMTP_PORT) === 465,
          auth: {
            user: process.env.BREVO_SMTP_LOGIN,
            pass: process.env.BREVO_SMTP_PASSWORD,
          },
        })
      : nodemailer.createTransport({ jsonTransport: true });

    const fromAddress = process.env.BREVO_EMAIL_FROM || "no-reply@local.dev";

    const info = await transporter.sendMail({
      from: `"Wanderlust" <${fromAddress}>`,
      to,
      subject,
      html,
    });

    if (!smtpConfigured) {
      console.warn("[DEV EMAIL] SMTP not configured. Using mock json transport.");
      console.log("[DEV EMAIL] To:", to);
      console.log("[DEV EMAIL] Subject:", subject);
    } else {
      console.log("Email sent successfully!", info.messageId);
    }

    return {
      info,
      mock: !smtpConfigured,
    };
  } catch (err) {
    const message = getFriendlyEmailError(err);
    console.error("SMTP Email Error >>>", message);
    throw new Error(`Email sending failed: ${message}`);
  }
}

module.exports = sendEmail;
