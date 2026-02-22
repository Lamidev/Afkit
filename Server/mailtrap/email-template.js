// ─── AFKIT BRAND TOKENS ───────────────────────────────────────────────────────
const BRAND_ORANGE = "#f97316";
const BRAND_DARK   = "#0d1b2a";
const BRAND_LIGHT  = "#fff7ed";


const HEADER_ROW = `
  <tr>
    <td style="background:linear-gradient(135deg, ${BRAND_DARK} 0%, #1e3a5f 100%); padding: 50px 40px; text-align: center;">
      <a href="https://afkit.ng" target="_blank" style="text-decoration:none; display:inline-block;">
        <span style="color:#ffffff; font-family:'Arial Black',Gadget,sans-serif; font-size: 32px; font-weight: 900; letter-spacing: -2px; line-height: 1;">
          AFK<span style="color:${BRAND_ORANGE};">i</span>T
        </span>
        <div style="color:rgba(255,255,255,0.4); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px;">
          Premium UK Gadgets
        </div>
      </a>
    </td>
  </tr>
`;

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

// Wraps any body rows with the consistent outer shell (header + footer included)
const wrap = (bodyRows) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { background-color: #f8fafc !important; }
    p, li, td { line-height: 1.8 !important; }
    @media only screen and (max-width: 600px) {
      .inner-table { border-radius: 0 !important; }
      .content-cell { padding: 30px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:60px 20px;">
    <tr>
      <td align="center">
        <table class="inner-table" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;">
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

const VERIFICATION_EMAIL_TEMPLATE = wrap(`
  <tr>
    <td style="padding:60px 50px 20px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:${BRAND_DARK};">Verify Your Account</h1>
      <p style="margin:0;font-size:16px;color:#64748b;">You're almost there — just one step left.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 50px 60px;">
      <p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 32px;">
        Hello! Thank you for choosing <strong style="color:${BRAND_DARK};">Afkit</strong>.
        Use the code below to confirm your email address and activate your premium shopping experience:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:0 0 40px;">
            <div style="display:inline-block;background:${BRAND_LIGHT};border:2px dashed ${BRAND_ORANGE};border-radius:18px;padding:30px 60px;">
              <span style="font-size:48px;font-weight:950;letter-spacing:12px;color:${BRAND_DARK};font-family:'Courier New',monospace;">{verificationCode}</span>
            </div>
          </td>
        </tr>
      </table>
      <div style="background:#fef9f0;border-left:4px solid ${BRAND_ORANGE};border-radius:0 12px 12px 0;padding:18px 24px;margin-bottom:32px;">
        <p style="margin:0;font-size:13px;color:#92400e;font-weight:700;">⏱ This security code expires in <strong>15 minutes</strong>. Please do not share it.</p>
      </div>
      <p style="font-size:14px;color:#94a3b8;margin:0;">
        If you didn't create an Afkit account, you can safely delete this email.
      </p>
    </td>
  </tr>
`);

// Replace {resetURL} at send time
const PASSWORD_RESET_REQUEST_TEMPLATE = wrap(`
  <tr>
    <td style="padding:60px 50px 20px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:${BRAND_DARK};">Reset Password</h1>
      <p style="margin:0;font-size:16px;color:#64748b;">We received a request to recalibrate your account security.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 50px 60px;">
      <p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 32px;">
        Hello! Click the button below to choose a new password. This link remains active for <strong>1 hour</strong>.
        If you didn't request this change, your current password is still safe.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:40px;">
            <a href="{resetURL}" style="display:inline-block;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;font-size:16px;font-weight:900;padding:18px 48px;border-radius:14px;letter-spacing:0.5px;box-shadow:0 10px 20px rgba(249,115,22,0.25);">
              Reset My Password
            </a>
          </td>
        </tr>
      </table>
      <div style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:0 12px 12px 0;padding:18px 24px;margin-bottom:32px;">
        <p style="margin:0;font-size:13px;color:#991b1b;font-weight:700;">🔐 Security Protocol: Afkit staff will never ask for your password or reset link.</p>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        Alternative link:<br/>
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

const WELCOME_EMAIL_TEMPLATE = wrap(`
  <tr>
    <td style="padding:40px 40px 20px;">
      <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:${BRAND_DARK};">Welcome to Afkit, {name}! 🎊</h1>
      <p style="margin:0;font-size:16px;color:#64748b;">Your gateway to premium UK-used gadgets.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px 40px;">
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
        We're excited to have you on board! At <strong>Afkit</strong>, we specialize in high-quality, 
        carefully tested UK-used smartphones, laptops, and accessories — all backed by our 
        exclusive <strong>6-month warranty</strong>.
      </p>
      
      <div style="background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:32px;border:1px solid #e2e8f0;">
        <h3 style="margin:0 0 16px;font-size:14px;color:${BRAND_DARK};text-transform:uppercase;letter-spacing:1px;">What you get with Afkit:</h3>
        <ul style="margin:0;padding:0;list-style:none;">
          <li style="margin-bottom:12px;display:flex;align-items:center;">
            <span style="font-size:20px;margin-right:12px;">🛡️</span>
            <span style="font-size:14px;color:#475569;"><strong>6-Month Warranty</strong> on all gadgets</span>
          </li>
          <li style="margin-bottom:12px;display:flex;align-items:center;">
            <span style="font-size:20px;margin-right:12px;">🚚</span>
            <span style="font-size:14px;color:#475569;"><strong>Free Nationwide Delivery</strong> across Nigeria</span>
          </li>
          <li style="margin-bottom:0;display:flex;align-items:center;">
            <span style="font-size:20px;margin-right:12px;">🤝</span>
            <span style="font-size:14px;color:#475569;"><strong>Payment on Delivery</strong> available</span>
          </li>
        </ul>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:32px;">
            <a href="https://afkit.ng/shop/listing" style="display:inline-block;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 44px;border-radius:12px;box-shadow:0 4px 14px rgba(249,115,22,0.35);">
              Start Shopping Now
            </a>
          </td>
        </tr>
      </table>
      
      <p style="font-size:14px;color:#94a3b8;text-align:center;margin:0;">
        Need help? Reply to this email or chat with us on <a href="https://wa.me/2348164014304" style="color:${BRAND_ORANGE};text-decoration:none;font-weight:600;">WhatsApp</a>.
      </p>
    </td>
  </tr>
`);

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
const getOrderConfirmationTemplate = (order) => {
  const itemsHtml = order.cartItems.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;color:#1e293b;font-weight:600;">
              ${item.title}
              ${item.condition ? `<br/><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:2px 8px;border-radius:20px;display:inline-block;margin-top:4px;${
                item.condition === 'Brand New'
                  ? 'background:#fef9c3;color:#92400e;border:1px solid #fde68a;'
                  : 'background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;'
              }">${item.condition}</span>` : ''}
            </td>
            <td align="right" style="font-size:14px;color:#64748b;">x${item.quantity}</td>
            <td align="right" style="font-size:14px;color:#1e293b;font-weight:700;padding-left:12px;">₦${Number(item.price).toLocaleString()}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const isPOD = order.paymentType === "commitment";
  const isGift = order.addressInfo?.isGift;
  const isAssisted = order.addressInfo?.isAssisted;
  const recipientName = order.addressInfo?.receiptName || order.addressInfo?.fullName;

  return wrap(`
    <tr>
      <td style="padding:60px 50px 30px;">
        <div style="background:#f0fdf4;border-radius:12px;padding:12px 24px;display:inline-block;margin-bottom:24px;">
          <span style="color:#15803d;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Order Confirmed ✅</span>
        </div>
        ${isGift ? `
        <div style="background:#f5f3ff;border-radius:12px;padding:12px 24px;display:inline-block;margin-bottom:24px;margin-left:8px;border:1px solid #ddd6fe;">
          <span style="color:#7c3aed;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">🎁 Surprise Gift</span>
        </div>
        ` : ''}
        ${isAssisted ? `
        <div style="background:#eff6ff;border-radius:12px;padding:12px 24px;display:inline-block;margin-bottom:24px;margin-left:8px;border:1px solid #dbeafe;">
          <span style="color:#1d4ed8;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">🤝 Assisted Order</span>
        </div>
        ` : ''}
        <h1 style="margin:0;font-size:28px;font-weight:900;color:${BRAND_DARK}; line-height: 1.2;">THANK YOU FOR YOUR ORDER</h1>
        <p style="margin:8px 0 0;font-size:16px;color:#64748b;">Order Ref: <strong style="color:${BRAND_ORANGE};">#${order.orderId?.startsWith('ORD-') ? order.orderId : 'ORD-' + (order.orderId || order._id || 'PENDING').toString().slice(-8).toUpperCase()}</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px 40px;">
        <div style="background:#f8fafc;border-radius:16px;padding:24px;border:1px solid #e2e8f0;margin-bottom:32px;">
          <h3 style="margin:0 0 16px;font-size:12px;color:${BRAND_DARK};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">Order Summary</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml}
            <tr>
              <td style="padding-top:20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:14px;color:#64748b;">Subtotal</td>
                    <td align="right" style="font-size:14px;color:#1e293b;font-weight:600;">₦${Number(order.totalAmount).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="font-size:14px;color:#64748b;padding:8px 0;">Delivery</td>
                    <td align="right" style="font-size:14px;color:#16a34a;font-weight:600;">FREE</td>
                  </tr>
                  <tr>
                    <td style="font-size:16px;color:${BRAND_DARK};font-weight:800;padding-top:12px;border-top:2px solid #e2e8f0;">Total</td>
                    <td align="right" style="font-size:18px;color:${BRAND_DARK};font-weight:800;padding-top:12px;border-top:2px solid #e2e8f0;">₦${Number(order.totalAmount).toLocaleString()}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <div style="background:${BRAND_DARK};border-radius:16px;padding:24px;color:#ffffff;margin-bottom:32px;">
          <h3 style="margin:0 0 12px;font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;">Payment Status</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td style="font-size:14px;color:rgba(255,255,255,0.8);">Paid via Paystack</td>
              <td align="right" style="font-size:14px;color:#ffffff;font-weight:700;">₦${Number(order.amountPaid).toLocaleString()}</td>
            </tr>
            ${isPOD ? `
            <tr>
              <td style="font-size:14px;color:#fbbf24;padding-top:12px;"><strong>Balance on Arrival</strong></td>
              <td align="right" style="font-size:16px;color:#fbbf24;font-weight:800;padding-top:12px;">₦${Number(order.balanceAmount).toLocaleString()}</td>
            </tr>
            <tr style="text-align:center;">
              <td colspan="2" style="padding-top:16px;">
                <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);font-style:italic;">
                  ${isAssisted || isGift ? `Please ensure <strong>${recipientName}</strong> has the balance ready for the rider.` : 'Please have the balance ready for the rider on delivery.'}
                </p>
              </td>
            </tr>
            ` : `
            <tr>
              <td colspan="2" style="padding-top:12px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#4ade80;font-weight:700;">FULL PAYMENT RECEIVED — NO BALANCE DUE AT DOOR</p>
              </td>
            </tr>
            `}
          </table>
        </div>

        <div style="border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:32px;">
          <h3 style="margin:0 0 12px;font-size:12px;color:${BRAND_DARK};text-transform:uppercase;letter-spacing:1px;">Delivery Details</h3>
          <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
            <strong>Recipient: ${recipientName}</strong><br/>
            Address: ${order.addressInfo?.address || 'N/A'}<br/>
            City: ${order.addressInfo?.city || 'N/A'}<br/>
            Phone: ${order.addressInfo?.phone || 'N/A'}
          </p>
          ${isGift || isAssisted ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #e2e8f0;">
             <p style="margin:0;font-size:12px;color:#6b21a8;"><strong>Order Category:</strong> ${isGift ? 'Gift' : 'Assisted Purchase'}</p>
             ${order.addressInfo?.recipientEmail ? `<p style="margin:4px 0 0;font-size:12px;color:#6b21a8;">Warranty certificate will be sent to: ${order.addressInfo.recipientEmail}</p>` : ''}
          </div>
          ` : ''}
        </div>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <p style="font-size:14px;color:#64748b;margin-bottom:20px;">Order is being processed for delivery in 1-3 business days.</p>
              <a href="https://afkit.ng/shop/account" style="display:inline-block;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;padding:14px 32px;border-radius:10px;">
                View Order History
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `);
};

const getWarrantyActivationTemplate = (order) => {
  const isGift = order.addressInfo?.isGift;
  const isAssisted = order.addressInfo?.isAssisted;
  const isPOD = order.paymentType === "commitment";
  const recipientName = order.addressInfo?.receiptName || order.addressInfo?.fullName;
  const buyerName = order.addressInfo?.fullName;
  const deliveryDate = new Date().toLocaleDateString("en-NG", { dateStyle: "long" });
  
  const itemsList = order.cartItems.map(item => `
    <div style="padding:12px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">
      <div style="text-align:left;">
        <span style="font-weight:700;color:${BRAND_DARK};font-size:14px;display:block;">${item.title}</span>
        <span style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;">${item.condition || 'Standard'}</span>
      </div>
      <div style="text-align:right;">
        <div style="background:${item.condition === 'Brand New' ? '#fef9c3' : '#f1f5f9'};padding:4px 8px;border-radius:12px;color:${item.condition === 'Brand New' ? '#854d0e' : '#64748b'};font-size:10px;font-weight:800;">
          ${item.condition === 'Brand New' ? 'PREMIUM' : 'UK USED'}
        </div>
        ${(isAssisted || !isGift) ? `<div style="font-size:12px;font-weight:700;color:${BRAND_DARK};margin-top:4px;">₦${Number(item.price).toLocaleString()}</div>` : ''}
      </div>
    </div>
  `).join('');

  const greeting = isGift 
    ? `Congratulations <strong>${recipientName}</strong>! A special gift has officially arrived for you.`
    : isAssisted
    ? `Hello <strong>${recipientName}</strong>, your assisted purchase from <strong>${buyerName}</strong> has been delivered.`
    : `Hello <strong>${recipientName}</strong>, your new tech is now officially yours!`;

  const heroText = isGift ? "Your Gift Has Arrived!" : (isAssisted ? "Purchase Delivered!" : "Gadget Delivered!");

  return wrap(`
    <tr>
      <td style="padding:60px 40px 30px;text-align:center;">
        <div style="margin-bottom:30px;">
          <center>
          <div style="width:120px;height:120px;background:linear-gradient(135deg, #d4af37 0%, #f9d976 50%, #d4af37 100%);border-radius:60px;padding:2px;box-shadow:0 10px 25px rgba(212,175,55,0.4); border: 2px solid #b8860b;">
            <table width="100%" height="100%" cellpadding="0" cellspacing="0" style="border-radius:60px;border:2px dashed rgba(255,255,255,0.6);background-color:transparent;">
              <tr>
                <td align="center" valign="middle" style="padding:10px;">
                  <div style="color:#ffffff;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:2px;line-height:1;margin-bottom:2px;">AFKiT</div>
                  <div style="color:#ffffff;font-size:16px;font-weight:900;text-transform:uppercase;letter-spacing:1px;line-height:1;margin-bottom:2px;">INSURED</div>
                  <div style="color:#ffffff;font-size:22px;line-height:1;">★</div>
                </td>
              </tr>
            </table>
          </div>
          </center>
        </div>
        <h1 style="margin:0 0 12px;font-size:32px;font-weight:900;color:${BRAND_DARK};text-transform:uppercase;letter-spacing:-1px;">${heroText}</h1>
        <p style="margin:0;font-size:18px;color:#64748b;line-height:1.6;">${greeting}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px 40px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);margin:20px 0 32px;">
          <div style="background:${BRAND_DARK};padding:15px;text-align:center;">
            <span style="color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Official Warranty Certificate: #${order.orderId?.startsWith('ORD-') ? order.orderId : 'ORD-' + (order.orderId || order._id || 'PENDING').toString().slice(-8).toUpperCase()}</span>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;text-align:center;">
              This document confirms that your AFKiT gadgets are authentic, fully tested, and insured under our protection plan.
            </p>
            
            <div style="background:#f8fafc;border-radius:16px;padding:8px;margin-bottom:24px;border:1px solid #f1f5f9;">
              ${itemsList}
              ${(isAssisted || !isGift) ? `
                <div style="padding:12px;border-top:2px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;">Order Total</span>
                  <span style="font-size:14px;font-weight:900;color:${BRAND_DARK};">₦${Number(order.totalAmount).toLocaleString()}</span>
                </div>
              ` : ''}
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed #e2e8f0;padding-top:20px;">
              <tr>
                <td style="padding:8px 0;">
                  <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Warranty Period:</span><br/>
                  <strong style="font-size:16px;color:#15803d;">6 MONTHS</strong>
                </td>
                <td align="right" style="padding:8px 0;">
                  <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Activation Date:</span><br/>
                  <strong style="font-size:16px;color:${BRAND_DARK};">${deliveryDate}</strong>
                </td>
              </tr>
            </table>
          </div>
        </div>

        ${isAssisted || isGift ? `
        <div style="background:${isGift ? '#f5f3ff' : '#eff6ff'};border-radius:16px;padding:22px;border:1px solid ${isGift ? '#ddd6fe' : '#dbeafe'};margin-bottom:32px;">
           <h3 style="margin:0 0 10px;font-size:13px;color:${isGift ? '#6b21a8' : '#1e40af'};text-transform:uppercase;letter-spacing:1px;">
             ${isGift ? '🎁 Gift Information' : '🤝 Assisted Purchase'}
           </h3>
           <p style="margin:0;font-size:13px;color:${isGift ? '#7c3aed' : '#1d4ed8'};font-weight:600;">
             ${isGift 
               ? `This gadget was sent as a surprise by <strong>${buyerName}</strong> and is fully paid for.` 
               : `This order was facilitated by <strong>${buyerName}</strong>. 
                  ${isPOD ? `<span style="color:#b45309;">Balance of ₦${Number(order.balanceAmount).toLocaleString()} was collected on delivery.</span>` : 'Payment was fully completed upfront.'}`
             }
           </p>
        </div>
        ` : ''}

        <div style="background:#fefce8;border-radius:16px;padding:22px;border:1px solid #fef3c7;margin-bottom:32px;">
          <h3 style="margin:0 0 10px;font-size:13px;color:#854d0e;text-transform:uppercase;letter-spacing:1px;">
            🛡️ Coverage Scope
          </h3>
          <ul style="margin:0;padding-left:20px;font-size:13px;color:#92400e;line-height:1.7;">
            <li>Covers all internal hardware defects and manufacturing faults.</li>
            <li>Activation is immediate upon delivery (${deliveryDate}).</li>
            <li>Warranty is void if the gadget is opened by unauthorized personnel.</li>
            <li>Does not cover physical damage or liquid immersion.</li>
          </ul>
        </div>

        <div style="text-align:center;">
          <p style="font-size:14px;color:#94a3b8;margin-bottom:12px;">Need help setting up your new tech?</p>
          <a href="https://wa.me/2348164014304" style="background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;font-weight:800;font-size:13px;padding:12px 24px;border-radius:12px;display:inline-block;text-transform:uppercase;letter-spacing:1px;">Chat with Support &rarr;</a>
        </div>
      </td>
    </tr>
  `);
};

const getPayerDeliveryConfirmationTemplate = (order) => {
  const isGift = order.addressInfo?.isGift;
  const isAssisted = order.addressInfo?.isAssisted;
  const recipientName = order.addressInfo?.receiptName || order.addressInfo?.fullName;
  const deliveryDate = new Date().toLocaleDateString("en-NG", { dateStyle: "long" });

  return wrap(`
    <tr>
      <td style="padding:60px 40px 20px;text-align:center;">
        <div style="background:#f0fdf4;border-radius:12px;padding:12px 24px;display:inline-block;margin-bottom:24px;">
          <span style="color:#15803d;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">Transaction Complete ✅</span>
        </div>
        <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:${BRAND_DARK}; text-transform:uppercase;">DELIVERY SUCCESSFUL</h1>
        <p style="margin:0;font-size:16px;color:#64748b;">The order for <strong>${recipientName}</strong> was delivered today.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 50px 60px;">
        <div style="background:#f8fafc;border-radius:20px;padding:30px;border:1px solid #e2e8f0;margin-bottom:32px;">
          <h3 style="margin:0 0 15px;font-size:12px;color:${BRAND_DARK};text-transform:uppercase;letter-spacing:1px;">Purchase Details</h3>
          <p style="margin:0;font-size:14px;color:#475569;line-height:1.8;">
            <strong>Order ID:</strong> #${order.orderId?.startsWith('ORD-') ? order.orderId : 'ORD-' + (order.orderId || order._id || 'PENDING').toString().slice(-8).toUpperCase()}<br/>
            <strong>Delivered to:</strong> ${recipientName}<br/>
            <strong>Location:</strong> ${order.addressInfo?.city}<br/>
            <strong>Date:</strong> ${deliveryDate}
          </p>
        </div>

        <p style="font-size:15px;color:#475569;line-height:1.8;margin:0 0 32px;">
          ${isGift 
            ? `Your surprise gift for <strong>${recipientName}</strong> has been successfully delivered! We've also sent them their official warranty certificate.` 
            : isAssisted
            ? `The assisted purchase you facilitated for <strong>${recipientName}</strong> has been delivered. Thank you for using Afkit.`
            : `Your gadgets have been delivered. We hope you love your new tech!`
          }
        </p>

        <div style="background:${BRAND_LIGHT};border-left:4px solid ${BRAND_ORANGE};border-radius:0 12px 12px 0;padding:20px;margin-bottom:32px;">
          <p style="margin:0;font-size:14px;color:#92400e;font-weight:700;">🛡️ The 6-Month Afkit Warranty is now officially ACTIVE for this order.</p>
        </div>

        <div style="text-align:center;">
          <a href="https://afkit.ng/shop/account" style="display:inline-block;background:${BRAND_DARK};color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;padding:16px 40px;border-radius:12px;">
            View Order Records
          </a>
        </div>
      </td>
    </tr>
  `);
};

module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  getNewsletterSubscriberTemplate,
  getAdminNewsletterTemplate,
  getOrderConfirmationTemplate,
  getWarrantyActivationTemplate,
  getPayerDeliveryConfirmationTemplate,
  getDebateThankYouTemplate,
  getDebateAdminTemplate,
};
