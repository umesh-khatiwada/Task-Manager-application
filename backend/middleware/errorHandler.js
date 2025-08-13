const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err);
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map((error) => error.message).join(', ');
    error = {
      message,
      statusCode: 400,
    };
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = {
      message,
      statusCode: 400,
    };
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404,
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
