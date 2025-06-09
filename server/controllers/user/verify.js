import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import UserDB from "../../models/user.js";
import VerificationDB from "../../models/verify.js";
import Token from "../../utils/token.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import sendEmail from "../../utils/sendEmail.js";

const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!(await VerificationDB.findOne({ email })))
      throw resError(400, "Invalid email!");

    const record = await VerificationDB.findOne({ code });
    if (!record) throw resError(400, "Invalid verification code!");

    if (record.expiresAt < new Date())
      throw resError(410, "Expired verification code!");

    const newUser = await UserDB.create({
      name: record.name,
      username: record.username,
      email: record.email,
      password: record.password,
    });

    const refreshToken = Token.makeRefreshToken({
      id: newUser._id.toString(),
    });
    const accessToken = Token.makeAccessToken({
      id: newUser._id.toString(),
    });

    await UserDB.findByIdAndUpdate(newUser._id, {
      refreshToken,
      accessToken,
    });

    const isLocalhost =
      req.hostname === "localhost" || req.hostname === "127.0.0.1";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: !isLocalhost,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    await VerificationDB.findByIdAndDelete(record._id);
    const user = await UserDB.findById(newUser._id).select("-password");

    // Send verified email
    // Load the HTML file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let htmlFile = fs.readFileSync(
      path.join(__dirname, "../../assets/html/successSignup.html"),
      "utf8"
    );

    // htmlFile = htmlFile.replace(
    //   "{verifiedImage}",
    //   `${process.env.SERVER_URL}/image/verified`
    // );

    await sendEmail(user.email, "[K Khay] Successfully Verified", htmlFile);

    resJson(res, 200, "Success signup.", user);
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default verify;
