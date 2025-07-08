const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err.stack); // Log in console

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  //  Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  //  Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    message = `Duplicate value entered for ${field}: "${err.keyValue[field]}"`;
    statusCode = 400;
  }

  //  Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  //  Final structured response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
