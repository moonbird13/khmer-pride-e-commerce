import nodemailer from 'nodemailer';

const sendPasswordResetCode = async ({ email, code }) => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw Object.assign(new Error('Email service is not configured.'), { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  await transporter.sendMail({
    from: EMAIL_FROM || EMAIL_USER,
    to: email,
    subject: 'Khmer Pride password reset code',
    text: `Your Khmer Pride password reset code is ${code}. It expires in 5 minutes. Do not share this code with anyone.`,
  });
};

export { sendPasswordResetCode };
