const nodemailer = require('nodemailer');
// https://ethereal.email/create pagina donde se crea
const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'helga81@ethereal.email',
        pass: 'sk7qR9GZqMRehGTYvv'
    }
};

module.exports = nodemailer.createTransport(mailConfig);