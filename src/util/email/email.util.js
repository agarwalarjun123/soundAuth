const nodemailer = require("nodemailer");
async function sendOTPMessage({ email, otp }) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "arjunagarwal1998@gmail.com",
      pass: "fvsdgmbkbwqkuxvg",
    },
  });
  await transporter.sendMail({
    from: '"Arjun Agarwal" arjunagarwal1998@gmail.com',
    to: email,
    subject: "Email OTP",
    html: `<b>Email OTP - ${otp}</b>`,
  });
}
module.exports = {
  sendOTPMessage,
};
