// ─── AFKIT BRAND TOKENS ───────────────────────────────────────────────────────
const BRAND_ORANGE = "#f97316";
const BRAND_DARK   = "#0d1b2a";
const BRAND_LIGHT  = "#fff7ed";

// ─── SHARED EMAIL HEADER ROW ──────────────────────────────────────────────────
const HEADER_ROW = `
  <tr>
    <td style="background:linear-gradient(135deg,${BRAND_DARK} 0%,#1e3a5f 100%);padding:36px 40px;text-align:center;">
      <div style="display:inline-block;background:${BRAND_ORANGE};border-radius:10px;padding:8px 20px;margin-bottom:12px;">
        <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">AFKIT</span>
      </div>
      <div style="width:40px;height:3px;background:${BRAND_ORANGE};border-radius:2px;margin:0 auto;"></div>
    </td>
  </tr>
`;

// ─── SHARED EMAIL FOOTER ROW ──────────────────────────────────────────────────
const FOOTER_ROW = `
  <tr>
    <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:12px;margin:0 0 6px;">
        &copy; ${new Date().getFullYear()} Afkit Technologies. All rights reserved.
      </p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        <a href="https://afkit.ng" style="color:#f97316;text-decoration:none;font-weight:600;">afkit.ng</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:info@afkit.ng" style="color:#94a3b8;text-decoration:none;">info@afkit.ng</a>
        &nbsp;&middot;&nbsp;Shop A25, Platinum Plaza, Computer Village, Ikeja
      </p>
    </td>
  </tr>
`;

// ─── BASE WRAPPER ──────────────────────────────────────────────────────────────
// Wraps any body rows with the consistent outer shell (header + footer included)
const wrap = (bodyRows) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Afkit Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          ${HEADER_ROW}
          ${bodyRows}
          ${FOOTER_ROW}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH TEMPLATES (static strings — placeholders replaced at send time)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Replace {verificationCode} at send time
const VERIFICATION_EMAIL_TEMPLATE = wrap(`
  <tr>
    <td style="padding:40px 40px 20px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND_DARK};">Verify Your Email Address</h1>
      <p style="margin:0;font-size:15px;color:#64748b;">You're almost there — just one step left.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;">
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
        Hello! Thank you for signing up with <strong style="color:${BRAND_DARK};">Afkit</strong>.
        Use the verification code below to confirm your email address and activate your account:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:8px 0 32px;">
            <div style="display:inline-block;background:${BRAND_LIGHT};border:2px dashed ${BRAND_ORANGE};border-radius:14px;padding:24px 48px;">
              <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:${BRAND_DARK};font-family:'Courier New',monospace;">{verificationCode}</span>
            </div>
          </td>
        </tr>
      </table>
      <div style="background:#fef9f0;border-left:4px solid ${BRAND_ORANGE};border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">⏱ This code expires in <strong>15 minutes</strong>. Don't share it with anyone.</p>
      </div>
      <p style="font-size:13px;color:#94a3b8;margin:0 0 40px;">
        If you did not create an Afkit account, you can safely ignore this email — no action is required.
      </p>
    </td>
  </tr>
`);

// Replace {resetURL} at send time
const PASSWORD_RESET_REQUEST_TEMPLATE = wrap(`
  <tr>
    <td style="padding:40px 40px 20px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND_DARK};">Reset Your Password</h1>
      <p style="margin:0;font-size:15px;color:#64748b;">We received a password reset request for your account.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;">
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 28px;">
        Hello! Click the button below to reset your password. This link is valid for <strong>1 hour</strong>.
        If you didn't request a password reset, please ignore this email — your password won't change.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:32px;">
            <a href="{resetURL}" style="display:inline-block;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 40px;border-radius:10px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(249,115,22,0.35);">
              Reset My Password
            </a>
          </td>
        </tr>
      </table>
      <div style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#991b1b;font-weight:600;">🔐 Never share this link with anyone. Afkit staff will never ask for it.</p>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin:0 0 40px;">
        If the button above doesn't work, copy and paste this URL into your browser:<br/>
        <span style="color:#f97316;word-break:break-all;">{resetURL}</span>
      </p>
    </td>
  </tr>
`);

const PASSWORD_RESET_SUCCESS_TEMPLATE = wrap(`
  <tr>
    <td style="padding:40px 40px 20px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND_DARK};">Password Reset Successful ✓</h1>
      <p style="margin:0;font-size:15px;color:#64748b;">Your password has been updated successfully.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:16px 0 32px;">
            <div style="width:72px;height:72px;background:linear-gradient(135deg,${BRAND_ORANGE},#ea580c);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:36px;line-height:72px;text-align:center;">
              ✓
            </div>
          </td>
        </tr>
      </table>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
        Great news! Your <strong style="color:${BRAND_DARK};">Afkit</strong> account password has been reset successfully.
        You can now log in with your new password.
      </p>
      <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0 0 6px;font-size:13px;color:#166534;font-weight:700;">🔒 Security Tips:</p>
        <ul style="margin:0;padding-left:16px;font-size:13px;color:#166534;">
          <li>Use a strong, unique password</li>
          <li>Never reuse passwords across different websites</li>
          <li>If this wasn't you, contact us immediately at <a href="mailto:info@afkit.ng" style="color:#16a34a;">info@afkit.ng</a></li>
        </ul>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:40px;">
            <a href="https://afkit.ng/auth/login" style="display:inline-block;background:${BRAND_DARK};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;">
              Log In to Afkit
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEWSLETTER TEMPLATES (functions — accept dynamic data, return HTML strings)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Subscriber welcome email
const getNewsletterSubscriberTemplate = () => wrap(`
  <tr>
    <td style="padding:40px 40px 20px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND_DARK};">Welcome to the Afkit Loop! 🚀</h1>
      <p style="margin:0;font-size:15px;color:#64748b;">You're now on the inside.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;">
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
        Thank you for subscribing to <strong style="color:${BRAND_DARK};">Afkit</strong>! You'll now be the first to know about:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        ${[
          ["🔥", "Exclusive deals on UK-used gadgets"],
          ["📦", "New arrivals and restocks before anyone else"],
          ["💡", "Tech tips and buying guides"],
          ["🎁", "Special giveaways and flash sales"],
        ]
          .map(
            ([icon, text]) => `
          <tr>
            <td style="padding:8px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:20px;padding-right:12px;vertical-align:middle;">${icon}</td>
                  <td style="font-size:14px;color:#475569;vertical-align:middle;">${text}</td>
                </tr>
              </table>
            </td>
          </tr>`
          )
          .join("")}
      </table>
      <div style="background:${BRAND_LIGHT};border-left:4px solid ${BRAND_ORANGE};border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:32px;">
        <p style="margin:0;font-size:14px;color:#92400e;font-weight:600;">🛍️ Premium UK-used gadgets &middot; 6-Month Warranty &middot; Nationwide Delivery</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:40px;">
            <a href="https://afkit.ng/shop/listing" style="display:inline-block;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 44px;border-radius:10px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(249,115,22,0.35);">
              Browse Our Shop &rarr;
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`);

// Admin notification when someone subscribes
const getAdminNewsletterTemplate = (subscriberEmail) => wrap(`
  <tr>
    <td style="padding:40px 40px 20px;">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${BRAND_DARK};">📬 New Newsletter Subscriber</h1>
      <p style="margin:0;font-size:14px;color:#64748b;">Someone just joined the Afkit mailing list.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;font-weight:700;">Subscriber Email</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${BRAND_DARK};">${subscriberEmail}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;font-weight:700;">Subscribed At</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#475569;">${new Date().toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEBATE CAMPAIGN TEMPLATES (functions — accept registration object, return HTML)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Thank-you email sent to the participant
const getDebateThankYouTemplate = ({ fullName, email, phone, tikTokHandle, instagramHandle }) => {
  const rows = [
    ["👤 Full Name", fullName],
    ["📧 Email", email],
    ["📱 Phone", phone],
    ...(tikTokHandle ? [["🎵 TikTok", tikTokHandle]] : []),
    ...(instagramHandle ? [["📸 Instagram", instagramHandle]] : []),
  ];

  return wrap(`
    <tr>
      <td style="padding:40px 40px 20px;">
        <div style="background:linear-gradient(135deg,${BRAND_ORANGE},#ea580c);border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
          <span style="font-size:36px;">🎤</span>
          <h1 style="margin:8px 0 4px;font-size:24px;font-weight:900;color:#ffffff;">You're Registered!</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);">Afkit Debate Campaign</p>
        </div>
        <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
          Hello <strong style="color:${BRAND_DARK};">${fullName}</strong>,<br/><br/>
          Thank you for registering for the <strong>Afkit Debate Campaign</strong>! 🎙️
          We're thrilled to have you as a participant. Your registration has been received and confirmed.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px 40px;">
        <p style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;font-weight:700;margin:0 0 12px;">Your Registration Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:28px;">
          ${rows
            .map(
              ([label, value], i) => `
            <tr>
              <td style="padding:14px 20px;border-bottom:${i < rows.length - 1 ? "1px solid #e2e8f0" : "none"};">
                <p style="margin:0;font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${label}</p>
                <p style="margin:3px 0 0;font-size:14px;font-weight:700;color:${BRAND_DARK};">${value}</p>
              </td>
            </tr>`
            )
            .join("")}
        </table>
        <div style="background:${BRAND_LIGHT};border-left:4px solid ${BRAND_ORANGE};border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0;font-size:14px;color:#92400e;font-weight:600;">📢 Watch your inbox and socials for updates about the debate event, schedule, and rules!</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <a href="https://afkit.ng/shop/home" style="display:inline-block;background:${BRAND_DARK};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;">
                Visit Afkit Website
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `);
};

// Admin notification when a new participant registers
const getDebateAdminTemplate = ({ fullName, email, phone, tikTokHandle, instagramHandle, createdAt }) => {
  const rows = [
    ["👤 Full Name", fullName],
    ["📧 Email", email],
    ["📱 Phone", phone],
    ["🎵 TikTok", tikTokHandle || "—"],
    ["📸 Instagram", instagramHandle || "—"],
    ["🕐 Registered At", createdAt
      ? new Date(createdAt).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })
      : new Date().toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })],
  ];

  return wrap(`
    <tr>
      <td style="padding:40px 40px 20px;">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${BRAND_DARK};">🎤 New Debate Registration</h1>
        <p style="margin:0;font-size:14px;color:#64748b;">A new participant has registered for the Afkit Debate Campaign.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          ${rows
            .map(
              ([label, value], i) => `
            <tr>
              <td style="padding:14px 20px;border-bottom:${i < rows.length - 1 ? "1px solid #e2e8f0" : "none"};">
                <p style="margin:0;font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${label}</p>
                <p style="margin:3px 0 0;font-size:14px;font-weight:700;color:${BRAND_DARK};">${value}</p>
              </td>
            </tr>`
            )
            .join("")}
        </table>
        <div style="background:#fef9f0;border-left:4px solid ${BRAND_ORANGE};border-radius:0 10px 10px 0;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">View all registrations in the Admin Panel &rarr; Debate Registrations</p>
        </div>
      </td>
    </tr>
  `);
};

// ─── EXPORTS ──────────────────────────────────────────────────────────────────
module.exports = {
  // Auth (static strings — replace placeholders with .replace() at send time)
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  // Newsletter (functions — call with data, returns HTML string)
  getNewsletterSubscriberTemplate,
  getAdminNewsletterTemplate,
  // Debate campaign (functions — call with registration object, returns HTML string)
  getDebateThankYouTemplate,
  getDebateAdminTemplate,
};
