import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `"K Khay" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
