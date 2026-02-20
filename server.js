/* ============================================================
   server.js — Bryant Phanvong Portfolio Backend
   Node.js + Express + Nodemailer

   SETUP INSTRUCTIONS:
   1. Run:  npm init -y
   2. Run:  npm install express nodemailer cors
   3. Fill in your Gmail address and App Password below
      (Generate an App Password at: myaccount.google.com/apppasswords)
   4. Run:  node server.js
   ============================================================ */

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = 5000;


/* ===== MIDDLEWARE ===== */

app.use(cors());               // Allow requests from your frontend
app.use(express.json());       // Parse JSON request bodies


/* ===== EMAIL TRANSPORTER ===== */
// Uses Gmail — replace with your own credentials

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_GMAIL@gmail.com',       // <-- Replace with your Gmail
        pass: 'YOUR_APP_PASSWORD'            // <-- Replace with your Gmail App Password
    }
});


/* ===== POST /send — RECEIVE AND FORWARD CONTACT FORM ===== */

app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const mailOptions = {
        from:    email,                          // sender's address from the form
        to:      'YOUR_GMAIL@gmail.com',         // <-- Your email (where you receive messages)
        subject: `New Portfolio Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #ff914d;">New Message from Your Portfolio</h2>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #fff; padding: 16px; border-radius: 6px; border-left: 4px solid #ff914d;">
                    ${message.replace(/\n/g, '<br>')}
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
                <p style="color: #999; font-size: 12px;">Sent from your portfolio contact form.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent from ${name} (${email})`);
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('❌ Email error:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});


/* ===== START SERVER ===== */

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
