"use server";

import nodemailder from "nodemailer";

export type SendResult =
  | { success: true }
  | { success: false; error: string };

export async function sendContactMail(formData: FormData): Promise<SendResult> {
    // Lees velden uit de browser FormData
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";

    // Eenvoudige server-side validatie
    if (!name || !email || !message) {
        return { success: false, error: "Vul alle velden in."};
    }

    // Basale sanitatie tegen header injection
    const sanitize = (s: string) => s.replace(/[\r\n<>]/g, " ").slice(0, 2000);

    try {
        const transporter = nodemailder.createTransport({
            // Gebuik Gmail of vervang met je SMTP-provider
            service: process.env.EMAIL_SERVICE ?? "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            // Zet 'from' op de geauthenticeerde gebruiker
            from: `"Website contact" <${process.env.EMAIL_USER}>`,
            // replyTo zo de inbox van de site-eigenaar nog direct laat antwoorden naar de bezoeker
            replyTo: sanitize(email),
            to: process.env.EMAIL_TO ?? "ontvanger@voorbeeld.be",
            subject: `Contactformulier: ${sanitize(name)}`,
            text: `Bericht van ${sanitize(name)} <${sanitize(email)}>\n\n${message}`
        });

        console.log("Mail verstuurd, id:", (info as any)?.messageId ?? info);
        return { success: true };
    } catch (err) {
        console.error("Mail error:", err);
        return { success: false, error: "Er ging iets mis bij het versturen van de mail."};
    }
}