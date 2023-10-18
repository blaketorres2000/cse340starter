const errorHandler = (err, req, res, next) => {
    // Custom error handling logic here, e.g., logging the error
    console.error(err);
  
    res.status(500).send('Internal 500 Type Server Error');
  };
  
  module.exports = errorHandler;