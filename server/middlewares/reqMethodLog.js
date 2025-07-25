export default function reqMethodLog(req, res, next) {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log([req.method, fullUrl]);
  next();
}
