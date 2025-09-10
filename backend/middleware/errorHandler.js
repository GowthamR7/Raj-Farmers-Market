// Enhanced global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('=== GLOBAL ERROR HANDLER ===');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Request Body:', req.body);
    console.error('User:', req.user?.email || 'Not authenticated');
    
    // Default error response
    let error = { ...err };
    error.message = err.message;
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: message
      });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      return res.status(400).json({
        success: false,
        message,
        errors: [message]
      });
    }
    
    // Mongoose ObjectId error
    if (err.name === 'CastError') {
      const message = 'Invalid ID format';
      return res.status(404).json({
        success: false,
        message,
        errors: [message]
      });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      const message = 'Invalid token';
      return res.status(401).json({
        success: false,
        message,
        errors: [message]
      });
    }
    
    // Default server error
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
      errors: [error.message || 'Internal server error'],
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;
  