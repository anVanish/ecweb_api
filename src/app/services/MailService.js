const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

// const templatePath = path.join()
class MailService{}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'Gmail',
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

MailService.sendMail = async (mailto, subject, link) => {
    const mailOptions = {
        from: 'mailservice2309@gmail.com',
        to: mailto,
        subject: subject,
        text: link
    }
    return transporter.sendMail(mailOptions)
}

module.exports = MailService
