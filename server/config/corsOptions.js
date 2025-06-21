// import allowedOrigins from "./allowedOrigins.js";

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

// export default corsOptions;
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin || "*"); // Allow all origins dynamically
  },
  optionsSuccessStatus: 200,
  credentials: true, // Required for cookies/auth headers
};

export default corsOptions;
