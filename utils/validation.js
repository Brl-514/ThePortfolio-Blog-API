/**
 * Validation utility functions
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  // 3-30 characters, alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeInput,
  validateObjectId
};

