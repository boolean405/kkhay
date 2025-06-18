import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const createGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { userIds, name } = req.body;

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "Authenticated user not found!");

    // Parse and validate userIds
    let arrayUserIds = Array.isArray(userIds) ? userIds : JSON.parse(userIds);
    if (!arrayUserIds.includes(userId)) arrayUserIds.push(userId);

    // Check if all userIds exist in DB
    const count = await UserDB.countDocuments({ _id: { $in: arrayUserIds } });
    if (count !== arrayUserIds.length)
      throw resError(404, "One or more users not found.");

    const newGroupChat = await ChatDB.create({
      name,
      users: arrayUserIds,
      isGroupChat: true,
      groupAdmins: userId,
    });

    const groupChat = await ChatDB.findById(newGroupChat._id).populate({
      path: "users groupAdmins",
      select: "-password",
    });
    resJson(res, 200, "Success create group chat.", groupChat);
  } catch (error) {
    next(error);
  }
};

export default createGroup;
