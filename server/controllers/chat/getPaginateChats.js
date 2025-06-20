import UserDB from "../../models/user.js";
import ChatDB from "../../models/chat.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

export default async function getPaginateChats(req, res, next) {
  try {
    const userId = req.userId;
    const pageNum = parseInt(req.params.pageNum);

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "Authenticated user not found!");

    if (isNaN(pageNum))
      throw resError(400, "Page number must be a valid number!");

    if (pageNum <= 0)
      throw resError(400, "Page number must be greater than 0!");

    const limit = Number(process.env.PAGINATE_LIMIT) || 15;
    const skipCount = limit * (pageNum - 1);

    const filter = {
      users: userId,
      // latestMessage: { $ne: null },
      deletedInfo: {
        $not: {
          $elemMatch: {
            user: userId,
          },
        },
      },
    };

    const chats = await ChatDB.find(filter)
      .sort({ "latestMessage.createdAt": -1, createdAt: -1 })
      .skip(skipCount)
      .limit(limit)
      .lean()
      .populate({
        path: "users groupAdmins",
        select: "-password",
      })
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      });

    const totalChat = await ChatDB.countDocuments(filter);
    const totalPage = Math.ceil(totalChat / limit);

    resJson(
      res,
      200,
      `${chats.length} chats returned from page ${pageNum} of ${totalPage}.`,
      {
        totalChat,
        totalPage,
        currentChat: chats.length,
        currentPage: pageNum,
        chats,
      }
    );
  } catch (error) {
    next(error);
  }
}
