import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const removeUserFromGroup = async (req, res, next) => {
  try {
    const user = req.userId;
    const { groupId, userId } = req.body;

    const [dbUser, userExists, dbChat] = await Promise.all([
      UserDB.exists({ _id: user }),
      UserDB.exists({ _id: userId }),
      ChatDB.findById(groupId),
    ]);

    if (!dbUser) throw resError(404, "Authenticated user not found!");
    if (!userExists) throw resError(404, "Target user not found!");
    if (!dbChat) throw resError(404, "Group chat not found!");
    if (!dbChat.users.includes(userId))
      throw resError(404, "Target user is not a member of this group chat.");
    if (!dbChat.users.includes(user))
      throw resError(403, "You are not a member of this group chat.");
    if (!dbChat.groupAdmin.equals(user))
      throw resError(403, "Only group admin can remove user!");
    if (dbChat.groupAdmin.equals(userId))
      throw resError(400, "Group admin cannot remove themselves.");

    const updatedChat = await ChatDB.findByIdAndUpdate(
      groupId,
      { $pull: { users: userId } },
      { new: true }
    ).populate({
      path: "users groupAdmin",
      select: "-password",
    });
    resJson(res, 200, "Success remove user from group chat.", updatedChat);
  } catch (error) {
    next(error);
  }
};

export default removeUserFromGroup;
