export default () => ({
  jwt: {
    accessToken: {
      secret: process.env.JWT_SECRET || 'default_access_secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '5m',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
  },
});
