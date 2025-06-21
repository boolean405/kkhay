// import allowedOrigins from "../config/allowedOrigins.js";

// const credentials = (req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Credentials", "true");
//   }
//   next();
// };

// export default credentials;

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", origin); // Dynamically set the origin
  }
  next();
};

export default credentials;
