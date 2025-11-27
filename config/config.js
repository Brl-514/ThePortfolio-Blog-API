/**
 * Application configuration
 */

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-blog',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

