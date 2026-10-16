export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, otpCode } = req.body;

  const brevoApiKey = process.env.BREVO_API_KEY; // इसे हम Vercel के Environment Variables में सेट करेंगे

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "TEAM PHANTOM", email: "support@teamphantom.com" }, // अपना वेरिफाइड सेंडर ईमेल यहाँ डाल देना
        to: [{ email: email }],
        subject: "🔒 Aapka Login OTP - TEAM PHANTOM",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #0b0f15; color: #ffffff; border-radius: 8px; border: 1px solid #f59e0b; max-width: 500px; margin: auto;">
              <div style="text-align: center; margin-bottom: 20px;">
                  <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                          <td style="width: 25%; text-align: center;">
                              <img src="https://phantom-9798.github.io/Test/logo.jpeg" alt="Logo" style="width: 45px; height: 45px; border-radius: 50%; border: 1px solid #f59e0b; object-fit: cover;">
                          </td>
                          <td style="width: 50%; text-align: center;">
                              <h2 style="color: #f59e0b; margin: 0; font-family: 'Orbitron', Arial, sans-serif; font-size: 20px; letter-spacing: 1px;">TEAM PHANTOM</h2>
                          </td>
                          <td style="width: 25%; text-align: center;">
                              <img src="https://phantom-9798.github.io/Test/logo.jpeg" alt="Logo" style="width: 45px; height: 45px; border-radius: 50%; border: 1px solid #f59e0b; object-fit: cover;">
                          </td>
                      </tr>
                  </table>
              </div>
              <p style="font-size: 16px; color: #e5e5e5;">Jai Hind, Cadet!</p>
              <p style="font-size: 15px; color: #d4d4d4;">Your official login OTP for the portal is given below:</p>
              <div style="background-color: #000; color: #f59e0b; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 6px; margin: 25px 0; border: 1px solid #f59e0b55;">
                  ${otpCode}
              </div>
              <p style="font-size: 14px; color: #a3a3a3;">Please enter this OTP into the website to gain access. Valid for this session only.</p>
              <hr style="border: none; border-top: 1px solid #262626; margin: 20px 0;">
              <p style="font-size: 12px; color: #737373; text-align: center;">Official Security System By TEAM PHANTOM &bull; Armed Forces Gateway</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ success: false, error: data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
