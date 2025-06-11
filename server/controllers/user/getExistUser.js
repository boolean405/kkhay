import UserDB from "../../models/user.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const getExistUser = async (req, res, next) => {
  try {
    const email = req.query.email;
    const user = await UserDB.findOne({ email }).select("-password");
    if (!user) return resJson(res, 404, "User not found!", null);

    resJson(res, 200, "Success get exist user.", user);
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default getExistUser;
