import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const changeName = async (req, res, next) => {
  try {
    const { name, chatId } = req.body;

    if (!(await ChatDB.exists({ _id: chatId })))
      throw resError(404, "Chat not found!");

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
