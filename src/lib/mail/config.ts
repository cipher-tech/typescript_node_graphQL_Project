import  nodemailer from  "nodemailer"

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rosemary.kozey60@ethereal.email',
        pass: 'uNzBW21FRN1xBuQ6Kc'
    }
});