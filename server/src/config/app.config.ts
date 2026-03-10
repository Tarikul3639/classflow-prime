export default () => ({
  PORT: parseInt(process.env.PORT || '5000', 10), // Default to 5000 if PORT is not set & 10 for parsing as decimal if we set 16 then it will parse as hexadecimal
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  APP_NAME: process.env.APP_NAME || 'ClassFlow-Prime',
});