module.exports = (err, req, res, next) => {
  console.error(err); // server-side log

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const payload = {
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error'
  };

  if (err.details) payload.details = err.details;

  res.status(status).json(payload);
};
