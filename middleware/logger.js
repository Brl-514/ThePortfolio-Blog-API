/**
 * Request logging middleware
 */

const logger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(log);
  });
  
  next();
};

module.exports = logger;

