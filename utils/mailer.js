import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
    try{
         const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_SMTP_USER, // SMTP username
                pass: process.env.MAILTRAP_SMTP_PASS, // SMTP password
            },
    });
    const info = await transporter.sendMail({
        from: 'ingest TMsS', // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
    });
    console.log('Message sent: %s', info.messageId);
    return info;
    }catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
   
