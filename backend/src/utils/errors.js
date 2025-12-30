// backend/src/utils/errors.js
export const notFound = (_req, res, _next) =>
  res.status(404).json({ error: 'Not found' });

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
};
