// Vercel Serverless Function: api/send-email.js
// Handles secure server-side email dispatching via EmailJS without exposing keys to the client browser.

export default async function handler(req, res) {
    // Enable CORS for development/testing if needed
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, Email and Message are required fields.' });
        }

        // Read Vercel Environment Variables
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Optional: EmailJS Private Key / Access Token

        if (!serviceId || !templateId || !publicKey) {
            return res.status(500).json({ 
                error: 'EmailJS keys are missing on the server. Please define EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in Vercel Environment Variables.' 
            });
        }

        // Payload structure for EmailJS REST API
        const payload = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
                name: name,
                email: email,
                message: message
            }
        };

        // If the user has configured a private key for extra security
        if (privateKey) {
            payload.accessToken = privateKey;
        }

        // Call EmailJS REST endpoint
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const successMsg = await response.text();
            return res.status(200).json({ success: true, message: successMsg });
        } else {
            const errorMsg = await response.text();
            return res.status(response.status).json({ error: `EmailJS API rejected request: ${errorMsg}` });
        }

    } catch (err) {
        console.error('Serverless function exception:', err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}
