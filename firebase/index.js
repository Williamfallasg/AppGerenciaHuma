const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configura el transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Cambia esto por tu correo electrónico
        pass: 'your-email-password'    // Cambia esto por la contraseña de tu correo
    }
});

// Función para enviar el correo electrónico
exports.sendPasswordResetEmail = functions.https.onCall((data, context) => {
    const email = data.email;
    const newPassword = data.newPassword;

    const mailOptions = {
        from: 'your-email@gmail.com', // Cambia esto por tu correo electrónico
        to: email,
        subject: 'Your New Password',
        text: `Your new password is: ${newPassword}`
    };

    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return { success: false, error: error.toString() };
        } else {
            return { success: true };
        }
    });
});
