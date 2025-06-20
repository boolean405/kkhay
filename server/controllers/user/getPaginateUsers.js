import UserDB from "../../models/user.js";
import resError from "../../utils/resError.js";
import resJson from "../../utils/resJson.js";

export default async function getPaginateUsers(req, res, next) {
  try {
    const userId = req.userId;
    const pageNum = Number(req.params.pageNum);

    if (!(await UserDB.exists({ _id: userId })))
      throw resError(404, "Authenticated user not found!");

    if (!pageNum) throw resError(400, "Page number must be only number!");

    if (pageNum <= 0)
      throw resError(400, "Page number must be greater than 0!");

    const limit = Number(process.env.PAGINATE_LIMIT);
    const reqPage = pageNum === 1 ? 0 : pageNum - 1;

    const skipCount = limit * reqPage;
    const totalUser = await UserDB.countDocuments();
    const users = await UserDB.find()
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit)
      .select("-password");
    resJson(
      res,
      200,
      `${users.length} users paginated of total ${totalUser} users, max ${limit} users per page`,
      { totalUser, users }
    );
  } catch (error) {
    next(error);
  }
}
