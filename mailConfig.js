const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "mehul.chattopadhyay@tuteck.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: "mehul.chattopadhyay@tuteck.com",
  to: "aritra.mitra@tuteck.com",
  subject: `The Tuteck Cafeteria`,
  html: <p>PFA the coffee details for today</p>,
};

module.exports = {
  transporter,
  mailOptions,
};
