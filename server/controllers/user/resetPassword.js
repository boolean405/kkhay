import UserDB from "../../models/user.js";
import Encoder from "../../utils/encoder.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await UserDB.findOne({ email });
    if (!user) throw resError(404, "User not found!");

    // Password Encryption
    const newHashedPassword = Encoder.encode(newPassword);
    await UserDB.findByIdAndUpdate(user._id, {
      password: newHashedPassword,
    });

    const updatedUser = await UserDB.findById(user._id).select("-password");

    resJson(res, 200, "Success changed password.", updatedUser);
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default resetPassword;
