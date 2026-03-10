export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '27017', 10),
    name: process.env.DB_NAME || 'classflow',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || '',
  },
});