import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    photo: { type: String },
    unreadCount: { type: Number, default: 0 },
    deletedInfo: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        deletedAt: { type: Date },
      },
    ],
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
