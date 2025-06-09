import mongoose from "mongoose";
const { Schema } = mongoose;

const verifySchema = new Schema(
  {
    name: { type: String, require: true },
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    code: { type: String, require: true },
    expiresAt: { type: Date, require: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Verify", verifySchema);
