const nodemailer = require('nodemailer');
const iplocation = require('iplocation');

// ENVOIE D'EMAIL
async function sendEmail(subject, sms, targ, exp, rep) {
    try {
        const transporter = nodemailer.createTransport({
            sendmail: true
        });

        const mailOptions = {
            from: `${exp.name} <${exp.email}>`,
            replyTo: `${rep.name} <${rep.email}>`,
            to: `${targ.name} <${targ.email}>`,
            subject: subject,
            html: sms
        };

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        return false;
    }
}

// LOCALISATION D'ADRESSE IP
async function ipLocation() {
    try {
        const ip = 'IP_DE_L_UTILISATEUR'; // Vous devrez obtenir l'adresse IP de l'utilisateur en fonction de votre application
        const location = await iplocation(ip);
        return location;
    } catch (error) {
        console.error('Erreur lors de la localisation de l\'adresse IP :', error);
        return 'NN';
    }
}

function generateComplexValue() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const length = 16; // Longueur de la valeur générée (vous pouvez ajuster selon vos besoins)
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

module.exports = {
    generateComplexValue
};