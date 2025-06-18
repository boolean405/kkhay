import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const addUserToGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { groupId, userIds } = req.body;

    const [userExists, chatExists] = await Promise.all([
      UserDB.exists({ _id: userId }),
      ChatDB.exists({ _id: groupId }),
    ]);
    if (!userExists) throw resError(404, "User not found!");
    if (!chatExists) throw resError(404, "Chat not found!");

    // Parse and validate userIds
    let arrayUserIds = Array.isArray(userIds) ? userIds : JSON.parse(userIds);
    if (!arrayUserIds.includes(userId)) arrayUserIds.push(userId);

    // Check if all userIds exist in DB
    const count = await UserDB.countDocuments({ _id: { $in: arrayUserIds } });
    if (count !== arrayUserIds.length)
      throw resError(404, "One or more users not found.");

    const updatedChat = await ChatDB.findByIdAndUpdate(
      groupId,
      { $addToSet: { users: { $each: arrayUserIds } } },

      { new: true }
    ).populate({
      path: "users groupAdmin",
      select: "-password",
    });

    resJson(res, 200, "Success add user to group chat.", updatedChat);
  } catch (error) {
    next(error);
  }
};

export default addUserToGroup;
