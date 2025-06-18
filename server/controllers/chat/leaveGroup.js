import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const leaveGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const groupId = req.body.groupId;

    const [userExists, dbGroup] = await Promise.all([
      UserDB.exists({ _id: userId }),
      ChatDB.findById(groupId),
    ]);

    if (!userExists) throw resError(404, "Authenticated user not found!");

    if (!dbGroup) throw resError(404, "Group chat not found!");
    if (!dbGroup.users.includes(userId))
      throw resError(403, "You are not a member of this group!");

    const isAdmin = dbGroup.groupAdmins.includes(userId);
    const isOnlyOneAdmin = isAdmin && dbGroup.groupAdmins.length === 1;

    // 🟡 Add deletedInfo entry
    await ChatDB.findByIdAndUpdate(groupId, {
      $addToSet: {
        deletedInfo: {
          user: userId,
          deletedAt: new Date(),
        },
      },
    });

    // Build the $pull object conditionally
    const pullFields = { users: userId };
    if (isAdmin) pullFields.groupAdmins = userId;

    const updatedGroup = await ChatDB.findByIdAndUpdate(
      groupId,
      {
        $pull: pullFields,
      },
      { new: true }
    ).populate({
      path: "users groupAdmins",
      select: "-password",
    });

    if (isOnlyOneAdmin && updatedGroup.groupAdmins.length === 0) {
      const newAdminId = updatedGroup.users[0]?._id;
      if (newAdminId)
        await ChatDB.findByIdAndUpdate(groupId, {
          $addToSet: { groupAdmins: newAdminId },
        });
    }

    resJson(res, 200, "Success leave group chat.");
  } catch (error) {
    next(error);
  }
};

export default leaveGroup;
