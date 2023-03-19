module.exports = {
    notFound: (req, res, next) => {
      const error = new Error('Not Found');
      error.status = 404;
      next(error);
    },
    errorHandler: (error, req, res, next) => {
      res.status(error.status || 500);
      res.render('error', {
        message: error.message,
        error: req.app.get('env') === 'development' ? error : {},
      });
    },
  };
  