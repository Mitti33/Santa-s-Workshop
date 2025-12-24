const nodemailer = require('nodemailer');

//Create a reusable transporter object
function createTransport(){
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

// Confirmation email (sent immediately after form submission) 
async function sendConfirmationEmail({ to, name, wish }) { 
    const transporter = createTransport();
    return transporter.sendMail({ 
        from: `"Santa 🎅" <${process.env.SMTP_USER}>`, 
        to, 
        subject: "🎄 Santa received your letter!", 
        html: ` <h1>Hi ${name}!</h1> 
        <p>Santa has received your wish: <b>${wish}</b>.</p> 
        <p>Stay tuned—your magical gift will arrive on Christmas morning!</p> 
        <p>🎄✨ With love from Santa’s Workshop ✨🎄</p> ` 
    }); 
}

//Send a gift email
async function sendGiftEmail({to, name, wish, giftUrl}) {
    const transporter = createTransport();
    const subject = `🎁 Your Christmas gift is ready, ${name}!`;
    const text = `Hi ${name},
Santa read your wish: "${wish}".
Your personal gift will be ready to unwrap on Christmas morning 🎄
✨ Warm hugs,
Santa’s Workshop`;

    const info = await transporter.sendMail({
        from: `"Santa 🎅" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: ` 
            <h2>Merry Christmas, ${name}!</h2> 
            <p>Santa read your wish: <b>${wish}</b></p> 
            <p>Click here to unwrap your gift: <a href="${giftUrl}">${giftUrl}</a></p> 
            <p>🎄✨ With love from Santa’s Workshop ✨🎄</p> 
        `
    });
    return info;
}

//Fire!
module.exports = {sendConfirmationEmail, sendGiftEmail};