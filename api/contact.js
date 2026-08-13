export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { name, email, subject, message } = req.body || {};

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                error: "Name, email, and message are required."
            });
        }

        // Limit input sizes
        if (
            String(name).length > 100 ||
            String(email).length > 254 ||
            String(subject || "").length > 200 ||
            String(message).length > 5000
        ) {
            return res.status(400).json({
                error: "One or more fields are too long."
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(String(email))) {
            return res.status(400).json({
                error: "Please enter a valid email address."
            });
        }

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error("RESEND_API_KEY is not configured.");
            return res.status(500).json({
                error: "Email service is not configured."
            });
        }

        const safeName = String(name).trim();
        const safeEmail = String(email).trim();
        const safeSubject = String(subject || "Portfolio Contact").trim();
        const safeMessage = String(message).trim();

        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Portfolio Contact <onboarding@resend.dev>",
                to: ["mshahid3845@gmail.com"],
                reply_to: safeEmail,
                subject: `[Portfolio] ${safeSubject}`,
                text:
`New message from your portfolio

Name: ${safeName}
Email: ${safeEmail}
Subject: ${safeSubject}

Message:
${safeMessage}`
            })
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
            console.error("Resend error:", resendData);

            return res.status(500).json({
                error: "Failed to send message."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error("Contact API error:", error);

        return res.status(500).json({
            error: "Failed to send message. Please try again."
        });
    }
}