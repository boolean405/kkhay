import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const createGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { userIds, name } = req.body;

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "User not found!");

    // Parse and validate userIds
    const arrayUserIds = Array.isArray(userIds) ? userIds : JSON.parse(userIds);
    if (!userIds.includes(userId)) {
      arrayUserIds.push(userId);
    }

    const newGroupChat = await ChatDB.create({
      name,
      users: userIds,
      isGroupChat: true,
      groupAdmin: userId,
    });

    const groupChat = await ChatDB.findById(newGroupChat._id).populate({
      path: "users groupAdmin",
      select: "-password",
    });
    resJson(res, 200, "Success create group chat.", groupChat);
  } catch (error) {
    next(error);
  }
};

export default createGroup;
