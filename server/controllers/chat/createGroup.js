import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import generateGroupPhoto from "../../utils/generateGroupPhoto.js";
import uploadGroupPhoto from "../../utils/uploadGroupPhoto.js";

const createGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { userIds, name } = req.body;

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "Authenticated user not found!");

    // Parse and validate userIds
    let arrayUserIds = Array.isArray(userIds) ? userIds : JSON.parse(userIds);
    if (!arrayUserIds.includes(userId)) arrayUserIds.push(userId);

    const users = await UserDB.find({ _id: { $in: arrayUserIds } });
    if (users.length !== arrayUserIds.length)
      throw resError(404, "One or more users not found.");

    // Generate image
    const imageUrls = users
      .map((u) => u.profilePhoto)
      .filter(Boolean)
      .slice(0, 4);

    let groupPhotoUrl = null;
    if (imageUrls.length > 0) {
      const base64Image = await generateGroupPhoto(imageUrls);
      groupPhotoUrl = await uploadGroupPhoto(
        null,
        "photo",
        base64Image,
        "kkhay/chats/group_photo"
      );
    }

    const newGroupChat = await ChatDB.create({
      name: `Group chat with ${name}`,
      photo: groupPhotoUrl,
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
