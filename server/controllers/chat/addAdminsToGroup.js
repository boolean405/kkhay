import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const addAdminsToGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { groupId, userIds } = req.body;

    const [userExists, dbChat] = await Promise.all([
      UserDB.exists({ _id: userId }),
      ChatDB.findById(groupId),
    ]);
    if (!userExists) throw resError(404, "Authenticated user not found!");
    if (!dbChat) throw resError(404, "Group chat not found!");
    if (!dbChat.groupAdmins.includes(userId))
      throw resError(403, "Only group admin can add admin!");

    const arrayUserIds = Array.isArray(userIds) ? userIds : JSON.parse(userIds);

    const alreadyAdmins = arrayUserIds.filter((id) =>
      dbChat.groupAdmins.includes(id)
    );
    if (alreadyAdmins.length) {
      throw resError(
        400,
        `User with id ${alreadyAdmins.join(", ")} already admin!`
      );
    }

    // Check if all userIds exist in DB
    const count = await UserDB.countDocuments({ _id: { $in: arrayUserIds } });
    if (count !== arrayUserIds.length)
      throw resError(404, "One or more users not found.");

    const updatedChat = await ChatDB.findByIdAndUpdate(
      groupId,
      { $addToSet: { groupAdmins: { $each: arrayUserIds } } },

      { new: true }
    ).populate({
      path: "users groupAdmins",
      select: "-password",
    });

    resJson(res, 200, "Success add admin to group chat.", updatedChat);
  } catch (error) {
    next(error);
  }
};

export default addAdminsToGroup;
