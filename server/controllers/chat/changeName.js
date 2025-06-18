import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const changeName = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, chatId } = req.body;

    const [userExists, chatExists] = await Promise.all([
      UserDB.exists({ _id: userId }),
      ChatDB.exists({ _id: chatId }),
    ]);

    if (!userExists) throw resError(404, "User not found!");
    if (!chatExists) throw resError(404, "Chat not found!");

    const updatedChat = await ChatDB.findByIdAndUpdate(
      chatId,
      { name },
      { new: true }
    ).populate({
      path: "users groupAdmin",
      select: "-password",
    });

    resJson(res, 200, "Success rename chat.", updatedChat);
  } catch (error) {
    next(error);
  }
};

export default changeName;
