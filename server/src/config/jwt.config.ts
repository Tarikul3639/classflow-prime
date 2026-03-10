export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultsecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
});