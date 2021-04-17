const errorHandler = (error, _req, res, _next) => {
  if (error && !res.headersSent) {
    res.status(error.code | 500).send(error);
  }
};

export default errorHandler;
