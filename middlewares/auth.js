function error(status, msg) {
  let err = new Error(msg);
  err.status = status;
  return err;
}

function apiKeyCheck(req, res, next) {
  let key = req.query["api-key"];
  if (!key) return next(error(400, "api key required"));
  if (apiKeys.indexOf(key) === -1) return next(error(401, "invalid api key"));
  req.key = key;
  next();
}

module.exports = apiKeyCheck;
