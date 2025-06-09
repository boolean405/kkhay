import UserDB from "../../models/user.js";
import resJson from "../../utils/resJson.js";

const signout = async (req, res, next) => {
  try {
    const decodedId = req.decodedId;
    const user = await UserDB.findById(decodedId);
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return resJson(res, 204);
    }
    await UserDB.findByIdAndUpdate(user._id, {
      refreshToken: "",
      accessToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    resJson(res, 200, "Success signout.");
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default signout;
