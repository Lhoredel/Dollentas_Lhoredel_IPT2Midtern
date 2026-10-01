export function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({
      message: "A record with the same unique value already exists."
    });
  }

  if (error.code === "23503") {
    return res.status(400).json({
      message: "The referenced record does not exist."
    });
  }

  res.status(error.status || 500).json({
    message: error.message || "Internal server error."
  });
}
