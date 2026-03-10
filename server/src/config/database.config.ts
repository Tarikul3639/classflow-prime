export interface DatabaseConfig {
  uri?: string;
}

export default () => ({
  database: {
    uri: process.env.MONGODB_URI,
  },
});
