import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const getAllChats = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "Authenticated user not found!");

    const chats = await ChatDB.find({
      users: userId,
    })
      .populate({
        path: "users groupAdmin",
        select: "-password",
      })
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      })
      .sort({ updatedAt: -1 });

    resJson(res, 200, "Fetched all user chats successfully.", chats);
  } catch (error) {
    next(error);
  }
};

export default getAllChats;
