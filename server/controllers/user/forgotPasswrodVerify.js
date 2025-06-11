import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import UserDB from "../../models/user.js";
import VerificationDB from "../../models/verify.js";
import Token from "../../utils/token.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import sendEmail from "../../utils/sendEmail.js";
import resCookie from "../../utils/resCookie.js";

const forgotPasswordVerify = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!(await VerificationDB.findOne({ email })))
      throw resError(400, "Invalid email!");

    const record = await VerificationDB.findOne({ code });
    if (!record) throw resError(400, "Invalid verification code!");

    if (record.expiresAt < new Date())
      throw resError(410, "Expired verification code!");

    await VerificationDB.findByIdAndDelete(record._id);

    resJson(res, 200, "Success verify, now change your password.");
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default forgotPasswordVerify;
