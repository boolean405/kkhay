import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const createOrOpen = async (req, res, next) => {
  try {
    const userId = req.userId;
    const receiverId = req.body.receiverId;

    const [userExists, receiver] = await Promise.all([
      UserDB.exists({ _id: userId }),
      UserDB.findById(receiverId),
    ]);

    if (!userExists) throw resError(404, "User not found!");
    if (!receiver) throw resError(404, "Receiver not found!");

    const isChat = await ChatDB.findOne({
      isGroupChat: false,
      users: { $all: [userId, receiverId] },
    })
      .populate({
        path: "users",
        select: "-password",
      })
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      });

    if (isChat) return resJson(res, 200, "Success open pm chat.", isChat);

    const newChat = {
      name: receiver.name,
      users: [userId, receiverId],
    };

    const dbChat = await ChatDB.create(newChat);
    const chat = await ChatDB.findById(dbChat._id)
      .populate("latestMessage")
      .populate({
        path: "users",
        select: "-password",
      });

    resJson(res, 200, "Created PM chat.", chat);
  } catch (error) {
    next(error);
  }
};

export default createOrOpen;
