// sirve para pruebas no en produccionse se isntalara sedgrid apra produccion
//npm install nodemailer-sendgrid-transport
// https://ethereal.email/create pagina donde se crea
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;

if (process.env.NODE_ENV === 'production') {
    const options ={
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    };
    mailConfig = sgTransport(options);

} else {
    
    if (process.env.NODE_ENV === 'staging') {
        console.log('XXXXXXXXXXXXXXXXXXX');
        const options ={
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        };
        mailConfig = sgTransport(options);
    }else{
        
        const options = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ethereal_user,
                pass: process.env.ethereal_pwd
                
            }
        };
        mailConfig = options;
    }
}

module.exports = nodemailer.createTransport(mailConfig);