export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.details
    });
  }

  if (err.message.includes('Invalid') || err.message.includes('Unauthorized')) {
    return res.status(401).json({
      success: false,
      message: err.message
    });
  }

  if (err.message.includes('Not found') || err.message.includes('not exist')) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
