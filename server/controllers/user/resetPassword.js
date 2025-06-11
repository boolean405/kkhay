import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import UserDB from "../../models/user.js";
import Encoder from "../../utils/encoder.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import Token from "../../utils/token.js";
import sendEmail from "../../utils/sendEmail.js";
import VerifyDB from "../../models/verify.js";
import resCookie from "../../utils/resCookie.js";

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

    const refreshToken = Token.makeRefreshToken({
      id: user._id.toString(),
    });
    const accessToken = Token.makeAccessToken({
      id: user._id.toString(),
    });

    await UserDB.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    // Send verified email
    // Load the HTML file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let htmlFile = fs.readFileSync(
      path.join(__dirname, "../../assets/html/successResetPassword.html"),
      "utf8"
    );

    // htmlFile = htmlFile.replace(
    //   "{verifiedImage}",
    //   `${process.env.SERVER_URL}/image/verified`
    // );

    const updatedUser = await UserDB.findById(user._id).select("-password");
    await sendEmail(
      updatedUser.email,
      "[K Khay] Password Successfully Changed",
      htmlFile
    );
    await VerifyDB.deleteOne({ email });

    resCookie(req, res, "refreshToken", refreshToken);
    resJson(res, 200, "Success changed password.", {
      user: updatedUser,
      accessToken,
    });
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default resetPassword;
