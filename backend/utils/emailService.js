const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
    },
});

/**
 * Sends an email using the configured Gmail transporter.
 * 
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Subject of the email
 * @param {string} htmlContent - HTML content of the email
 * @param {string} [context] - Optional context for logging (e.g., "Order Confirmation")
 */
const sendEmail = async (to, subject, htmlContent, context = "General") => {
    try {
        const mailOptions = {
            from: `"iStitch" <${process.env.EMAIL}>`,
            to,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Email: ${context}] Sent successfully to: ${to}`);
    } catch (error) {
        console.error(`[Email Error: ${context}]`, error);
    }
};

module.exports = { sendEmail };
