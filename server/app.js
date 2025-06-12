import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import corsOptions from "./config/corsOptions.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import credentials from "./middlewares/credentials.js";
import reqMethodLog from "./middlewares/reqMethodLog.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

// Routes
import userRoute from "./routes/user.js";
import imageRoute from "./routes/image.js";
import publicRoute from "./routes/public.js";

const app = express();

// Global middleware
app.use(reqMethodLog); // Log incoming requests (1st)
app.use(rateLimiter); // Rate limiting early (before body parsing)
app.use(credentials); // Set Access-Control-Allow-Credentials header
app.use(cors(corsOptions)); // Must follow `credentials`
app.use(express.json()); // Parse JSON body
app.use(cookieParser()); // Parse cookies
app.use(fileUpload({ useTempFiles: true })); // File uploads

// API routes
app.use("/api/user", userRoute);
app.use("/api/public", publicRoute);
app.use("/image", imageRoute);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
