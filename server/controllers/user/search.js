import UserDB from "../../models/user.js";
import resError from "../../utils/resError.js";
import resJson from "../../utils/resJson.js";

const search = async (req, res, next) => {
  try {
    const userId = req.userId;
    const keyword = req.query.keyword;

    const user = await UserDB.findById(userId);
    if (!user) throw resError(404, "User not found!");
    if (!keyword) throw resError(400, "Need to keyword something!");

    const searchKeyword = keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { userName: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};
    const users = await UserDB.find(searchKeyword)
      .find({ _id: { $ne: userId } })
      .select("-password");
    resJson(res, 200, "Success keyword users.", { users });
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default search;
