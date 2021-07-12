const nodemailer = require("nodemailer")
const sendEmail = async (options) => {
    try {
        var {from, to, subject, body} = options
        //create transport
        var transport = nodemailer.createTransport({ //its a promise
            host: process.env.EMAIL_SERVICE_HOST,
            port:  process.env.EMAIL_SERVICE_PORT,
            auth: {
              user:  process.env.EMAIL_SERVICE_USER,
              pass:  process.env.EMAIL_SERVICE_PASSWORD
            }
          });
        //define email option
        var mailOptions = {
            from: "ecraft@service.com",
            to,
            subject,
            text: body  //html <h1></h1>
        }
        //send email
        await transport.sendMail(mailOptions)
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendEmail