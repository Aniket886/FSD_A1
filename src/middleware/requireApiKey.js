const requireApiKey = (req, res, next) => {
  const configuredApiKey = process.env.API_KEY;

  if (!configuredApiKey) {
    return next();
  }

  const providedApiKey = req.get('x-api-key');

  if (providedApiKey !== configuredApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Provide a valid x-api-key header.'
    });
  }

  return next();
};

module.exports = requireApiKey;
