export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { email, otpCode } = req.body;
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      return res.status(500).json({ success: false, error: 'Config Error: BREVO_API_KEY is missing in Vercel settings.' });
    }

    if (!email || !otpCode) {
      return res.status(400).json({ success: false, error: 'Request Error: Email or OTP code is missing.' });
    }

    // Brevo API Request
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "TEAM PHANTOM", email: "teamphantom983@gmail.com" },
        to: [{ email: email }],
        subject: "🔒 Aapka Login OTP - TEAM PHANTOM",
        htmlContent: `
          <div style="font-family: 'Rajdhani', Arial, sans-serif; padding: 30px; background-color: #05080c; color: #ffffff; border-radius: 12px; border: 2px solid #f59e0b; max-width: 500px; margin: auto; box-shadow: 0 0 25px rgba(245,158,11,0.2);">
              
              <!-- LOGO & HEADER -->
              <div style="text-align: center; border-bottom: 1px solid rgba(245,158,11,0.3); padding-bottom: 20px; margin-bottom: 20px;">
                  <img src="https://team-phantom-enrollment.web.app/logo.jpeg" alt="TEAM PHANTOM" style="width: 70px; height: 70px; border-radius: 12px; border: 2px solid #f59e0b; object-fit: cover; margin-bottom: 10px; box-shadow: 0 0 15px rgba(245,158,11,0.4);" />
                  <br>
                  <span style="background-color: rgba(239, 68, 68, 0.2); color: #ef4444; padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.4); text-transform: uppercase; letter-spacing: 2px;">SECURE ACCESS PROTOCOL</span>
                  <h2 style="color: #f59e0b; font-size: 26px; font-weight: 900; letter-spacing: 2px; margin: 12px 0 5px 0; text-transform: uppercase;">TEAM PHANTOM</h2>
                  <p style="color: #9ca3af; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin: 0;">OFFICIAL CADET HEADQUARTERS</p>
              </div>
              
              <p style="color: #d1d5db; font-size: 14px; text-align: center; margin-bottom: 15px;">Target verification code requested. Use the secure operational OTP below to authenticate your session:</p>
              
              <div style="background-color: #000000; color: #f59e0b; padding: 18px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; border: 1px dashed rgba(245,158,11,0.6); margin: 20px 0;">
                  ${otpCode}
              </div>
              
              <p style="color: #ef4444; font-size: 11px; text-align: center; margin-top: 20px; font-weight: bold;">&#9888; CONFIDENTIAL: Do not share this tactical code with anyone.</p>
              
              <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px; margin-top: 20px; color: #6b7280; font-size: 10px; letter-spacing: 1px;">
                  TEAM PHANTOM &bull; ARMED FORCES PREPARATION &bull; &copy; 2026
              </div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } else {
      // Brevo का असली एरर सीधा फ्रंटएंड पर भेज देंगे
      return res.status(400).json({ 
        success: false, 
        error: `Brevo Error: ${data.message || JSON.stringify(data)} (Code: ${data.code || 'Unknown'})` 
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: `Server Crash: ${error.message}` });
  }
}
