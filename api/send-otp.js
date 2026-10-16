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
          <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #0b0f15; color: #ffffff; border-radius: 8px; border: 1px solid #f59e0b; max-width: 500px; margin: auto;">
              <h2 style="color: #f59e0b; text-align: center;">TEAM PHANTOM</h2>
              <p>Your official login OTP is:</p>
              <div style="background-color: #000; color: #f59e0b; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 6px;">
                  ${otpCode}
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
