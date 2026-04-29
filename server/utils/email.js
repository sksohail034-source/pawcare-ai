import nodemailer from 'nodemailer';

// Create transporter — works with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
export async function sendOTPEmail(to, otp, purpose = 'verify') {
  const subject = purpose === 'register' 
    ? '🐾 PawCare AI - Verify Your Email' 
    : '🔐 PawCare AI - Login Verification Code';

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fdf8; border-radius: 16px; overflow: hidden; border: 1px solid #e0f2e0;">
      <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 32px 24px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 8px;">🐾</div>
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">PawCare AI</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0; font-size: 14px;">Your Smart Pet Care Companion</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">Verification Code</h2>
        <p style="color: #666; font-size: 14px; margin: 0 0 24px;">
          ${purpose === 'register' ? 'Enter this code to complete your registration' : 'Enter this code to sign in to your account'}
        </p>
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px dashed #22c55e; border-radius: 16px; padding: 20px; margin: 0 0 24px;">
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #16a34a; font-family: monospace;">${otp}</div>
        </div>
        <p style="color: #999; font-size: 12px; margin: 0;">
          ⏰ This code expires in <strong>10 minutes</strong><br/>
          If you didn't request this, please ignore this email.
        </p>
      </div>
      <div style="background: #f1f5f1; padding: 16px 24px; text-align: center;">
        <p style="color: #888; font-size: 11px; margin: 0;">© 2026 PawCare AI — mypawcare.life</p>
      </div>
    </div>
  `;

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Email] ⚠️ SMTP not configured. OTP for ${to}: ${otp}`);
    console.log(`[Email] Set EMAIL_USER and EMAIL_PASS environment variables to enable email.`);
    return { success: true, fallback: true, otp }; // Return OTP for dev/testing
  }

  try {
    await transporter.sendMail({
      from: `"PawCare AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[Email] ✅ OTP sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error(`[Email] ❌ Failed to send to ${to}:`, err.message);
    // Fallback: log OTP to console so testing can continue
    console.log(`[Email] Fallback OTP for ${to}: ${otp}`);
    return { success: false, error: err.message, otp };
  }
}
