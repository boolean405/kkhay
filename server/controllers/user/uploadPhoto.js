import UserDB from "../../models/user.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import cloudinary from "../../config/cloudinary.js";
import getPublicIdFromUrl from "../../utils/getPublicIdFromUrl.js";

const uploadPhoto = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { profilePhoto, coverPhoto } = req.body;

    if (!profilePhoto && !coverPhoto) {
      throw resError(400, "Photo is required to upload!");
    }

    const user = await UserDB.findById(userId);
    if (!user) {
      throw resError(404, "User not found!");
    }

    const updateFields = {};

    const uploadImage = async (oldUrl, newData, folder) => {
      // Remove old image if exists and is hosted on Cloudinary
      if (oldUrl && oldUrl.includes("cloudinary")) {
        const publicId = getPublicIdFromUrl(oldUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      // Custom file name
      const public_id = `/${user.username}_${Date.now()}`;

      // Upload new image
      const result = await cloudinary.uploader.upload(newData, {
        folder,
        public_id,
      });
      return result.secure_url;
    };

    if (profilePhoto) {
      updateFields.profilePhoto = await uploadImage(
        user.profilePhoto,
        profilePhoto,
        "kkhay/users/profilephoto"
      );
    }

    if (coverPhoto) {
      updateFields.coverPhoto = await uploadImage(
        user.coverPhoto,
        coverPhoto,
        "kkhay/users/coverphoto"
      );
    }

    await UserDB.findByIdAndUpdate(userId, updateFields);

    const updatedUser = await UserDB.findById(userId).select("-password");

    resJson(res, 200, "Success upload photo", updatedUser);
  } catch (error) {
    next(error);
  }
};

export default uploadPhoto;
