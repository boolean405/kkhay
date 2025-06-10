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
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(reqMethodLog);
app.use(credentials);
app.use(cors(corsOptions));
app.use(fileUpload());

// API routes
app.use("/api/user", userRoute);
app.use("/api/public", publicRoute);
app.use("/image", imageRoute);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
