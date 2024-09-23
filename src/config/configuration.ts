export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  providers: process.env.PROVIDER,
  database: {
    uri: process.env.MONGO_URI,
    options: {
      dbName: process.env.MONGO_DB,
      retryWrites: true,
    },
  },
  authentication: {
    secret: process.env.AUTH_SECRET || 'secret',
    jwtOptions: {
      expiresIn: process.env.AUTH_EXPIRES_IN || '1d',
    },
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
