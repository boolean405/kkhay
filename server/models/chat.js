import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "message",
    },
    groupAdmins: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ name: 1 });
chatSchema.index({ groupAdmin: 1 });

export default mongoose.model("chat", chatSchema);
