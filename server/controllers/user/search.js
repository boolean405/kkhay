import UserDB from "../../models/user.js";
import resError from "../../utils/resError.js";
import resJson from "../../utils/resJson.js";

const search = async (req, res, next) => {
  try {
    const userId = req.userId;
    const keyword = req.query.search;

    const user = await UserDB.findById(userId);
    if (!user) throw resError(404, "User not found!");
    if (!keyword) throw resError(400, "Need to search something!");

    keyword
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { userName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await UserDB.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");
    resJson(res, 200, "Success search users.", { users });
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default search;
