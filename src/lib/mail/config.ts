import nodemailer from "nodemailer"

// export const Transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'rosemary.kozey60@ethereal.email',
//         pass: 'uNzBW21FRN1xBuQ6Kc'
//     }
// });

export const serverEmail = "support@sabic-aramco.com"
// async..await is not allowed in global scope, must use a wrapper
export async function Mailer(to: string = "support@sabic-aramco.com",
    subject: string = "Subject test",
    html: string = "<b>Hello world??? higher.</b>",
    text: string = 'OKOKO okay',
) {
    //   // Generate test SMTP service account from ethereal.email
    //   // Only needed if you don't have a real mail account for testing
    //   let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "sabic-aramco.com",
        port: 465,
        secure: !false, // true for 465, false for other ports
        auth: {
            user: "support@sabic-aramco.com", // generated ethereal user
            pass: "duQW5yJ_D&pd", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<support@sabic-aramco.com>', // sender address
        to: `${to}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${text}`, // plain text body
        html: `${html}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", { to, text, html, subject });
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
// Mailer("nickchibuikem@gmail.com", "Email Test", "<h1> Chibuikem Onubogu </h1>").catch(console.error);
// main().catch(console.error);