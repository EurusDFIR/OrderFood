/**
 * Async Handler - Wrapper để handle async errors
 * Thay thế try-catch trong controllers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
