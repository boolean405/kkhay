import UserDB from "../../models/user.js";
import resJson from "../../utils/resJson.js";
import Token from "../../utils/token.js";
import resError from "../../utils/resError.js";

const refresh = async (req, res, next) => {
  try {
    const decodedId = req.decodedId;
    const accessToken = Token.makeAccessToken({
      id: decodedId.toString(),
    });

    const user = await UserDB.findById(decodedId);
    if (!user) throw resError(404, "User not found!");

    await UserDB.findByIdAndUpdate(user._id, { accessToken });
    const updatedUser = await UserDB.findById(user._id).select("-password");

    resJson(res, 200, "Success refresh.", updatedUser);
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default refresh;
