export default () => ({
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    verificationCodeExpiresIn:
      process.env.EMAIL_VERIFICATION_EXPIRES || '15m',
  },
});