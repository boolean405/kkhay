import UserDB from "../../models/user.js";
import PictureDB from "../../models/picture.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import cloudinary from "../../config/cloudinary.js";

const uploadPhoto = async (req, res, next) => {
  try {
    const userId = req.userId;
    const profilePhoto = req.body.profilePhoto;
    const coverPhoto = req.body.coverPhoto;

    const user = await UserDB.findById(userId);
    if (!user) throw resError(404, "User not found!");

    if (!profilePhoto && !coverPhoto)
      throw resError(400, "Photo is required to upload!");

    // Upload photos to cloudinary
    if (profilePhoto) {
      // Delete old photo
      if (user.profilePhoto && user.profilePhoto.includes("cloudinary")) {
        const publicId = user.profilePhoto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Upload new photo
      const uploadResult = await cloudinary.uploader.upload(profilePhoto);
      await UserDB.findByIdAndUpdate(user._id, {
        profilePhoto: uploadResult.secure_url,
      });
    }

    if (coverPhoto) {
      // Delete old photo
      if (user.coverPhoto && user.coverPhoto.includes("cloudinary")) {
        const publicId = user.coverPhoto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Upload new photo
      const uploadResult = await cloudinary.uploader.upload(coverPhoto);
      await UserDB.findByIdAndUpdate(user._id, {
        coverPhoto: uploadResult.secure_url,
      });
    }

    // Save to DB
    const updatedUser = await UserDB.findById(user._id).select("-password");

    resJson(res, 200, "Success upload photo", updatedUser);
  } catch (error) {
    error.status = error.status;
    next(error);
  }
};

export default uploadPhoto;
