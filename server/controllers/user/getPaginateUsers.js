import UserDB from "../../models/user.js";
import resError from "../../utils/resError.js";
import resJson from "../../utils/resJson.js";

export default async function getPaginateUsers(req, res, next) {
  try {
    const userId = req.userId;
    const keyword = req.query.keyword;
    const gender = req.query.gender;
    const isOnline = req.query.isOnline;
    const pageNum = parseInt(req.params.pageNum, 10);

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "Authenticated user not found!");

    if (isNaN(pageNum))
      throw resError(400, "Page number must be a valid number!");

    if (pageNum <= 0)
      throw resError(400, "Page number must be greater than 0!");

    const limit = Number(process.env.PAGINATE_LIMIT) || 15;
    const skipCount = limit * (pageNum - 1);

    const keywordSearch = keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { userName: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const filter = {
      ...keywordSearch,
      _id: { $ne: userId },
    };

    // Extra filter
    if (gender && ["male", "female"].includes(gender.toLowerCase()))
      filter.gender = gender.toLowerCase();

    if (typeof isOnline !== "undefined") {
      if (isOnline === "true") filter.isOnline = true;
      else if (isOnline === "false") filter.isOnline = false;
    }

    const users = await UserDB.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit)
      .select("-password")
      .lean();

    const totalUser = await UserDB.countDocuments(filter);
    const totalPage = Math.ceil(totalUser / limit);
    resJson(
      res,
      200,
      `${users.length} users returned from page ${pageNum} of ${totalPage}.`,
      {
        totalUser,
        totalPage,
        currentUser: users.length,
        currentPage: pageNum,
        users,
      }
    );
  } catch (error) {
    next(error);
  }
}
