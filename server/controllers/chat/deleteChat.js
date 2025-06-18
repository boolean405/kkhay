import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const deleteChat = async (req, res, next) => {
  try {
    const userId = req.userId;
    const chatId = req.body.chatId;

    const [userExists, dbChat] = await Promise.all([
      UserDB.exists({ _id: userId }),
      ChatDB.findById(chatId),
    ]);

    if (!userExists) throw resError(404, "Authenticated user not found!");

    if (!dbChat) throw resError(404, "Chat not found!");
    if (!dbChat.users.includes(userId))
      throw resError(400, "You are not a user of this chat.");

    // Add user to deletedFor
    await ChatDB.findByIdAndUpdate(chatId, {
      $addToSet: {
        deletedInfo: {
          user: userId,
          deletedAt: new Date(),
        },
      },
    });

    resJson(res, 200, "Success deleted chat.");
  } catch (error) {
    next(error);
  }
};

export default deleteChat;
