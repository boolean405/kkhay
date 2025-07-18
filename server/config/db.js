import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
