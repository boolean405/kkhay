import "dotenv/config";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import connectDB from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import reqMethodLog from "./middlewares/reqMethodLog.js";
import credentials from "./middlewares/credentials.js";
import corsOptions from "./config/corsOptions.js";

// Route
import userRoute from "./routes/user.js";
import imageRoute from "./routes/image.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(reqMethodLog);
app.use(credentials);
app.use(cors(corsOptions));
app.use(fileUpload());


app.use("/api/user", userRoute);
app.use("/image", imageRoute);

// Connect to MongoDB
connectDB();
// MongoDB Connection)
mongoose.connection.once("open", () => {
  console.log(`=> Success, MongoDB Connected.`);
  app.listen(port, () => {
    console.log(`=> Server running on port ${port}`);
  });
});

// Error Handler
app.use(notFoundHandler);
app.use(errorHandler);
