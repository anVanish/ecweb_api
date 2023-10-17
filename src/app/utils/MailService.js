const nodemailer = require('nodemailer')

// const templatePath = path.join()
class MailService{}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'Gmail',
    secure: true,
    auth: {
        user: 'mailservice2309@gmail.com',
        pass: 'goti tzhg qabn nmkm'
    }
})

MailService.sendMail = async (mailto, subject, link) => {
    const mailOptions = {
        from: 'mailservice2309@gmail.com',
        to: mailto,
        subject: subject,
        text: link
    }
    transporter.sendMail(mailOptions)
}

module.exports = MailService
