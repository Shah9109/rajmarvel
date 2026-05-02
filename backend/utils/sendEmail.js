const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Return early if email credentials are not fully set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your_email@gmail.com') {
      console.log(`[Email Mock] To: ${options.email} | Subject: ${options.subject}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Raj Marvel Exterior Designs <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendEmail;
