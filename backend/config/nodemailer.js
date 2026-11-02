import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export default transporter;