import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const addUsersToGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { groupId, userIds } = req.body;

    const [userExists, dbChat] = await Promise.all([
      UserDB.exists({ _id: userId }),
      ChatDB.findById(groupId),
    ]);
    if (!userExists) throw resError(404, "Authenticated user not found!");
    if (!dbChat) throw resError(404, "Chat not found!");

    // Parse and validate userIds
    const arrayUserIds = Array.isArray(userIds) ? userIds : JSON.parse(userIds);

    const alreadyUsers = arrayUserIds.filter((id) =>
      dbChat.users.includes(id)
    );
    if (alreadyUsers.length) {
      throw resError(
        400,
        `User with id ${arrayUserIds.join(", ")} already user!`
      );
    }

    // Check if all userIds exist in DB
    const count = await UserDB.countDocuments({ _id: { $in: arrayUserIds } });
    if (count !== arrayUserIds.length)
      throw resError(404, "One or more users not found.");

    const updatedChat = await ChatDB.findByIdAndUpdate(
      groupId,
      { $addToSet: { users: { $each: arrayUserIds } } },

      { new: true }
    ).populate({
      path: "users groupAdmins",
      select: "-password",
    });

    resJson(res, 200, "Success add user to group chat.", updatedChat);
  } catch (error) {
    next(error);
  }
};

export default addUsersToGroup;
