import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";
import getPublicIdFromUrl from "./getPublicIdFromUrl.js";

const uploadImage = async (user, fileData, folder) => {
  // Remove old image if exists and is hosted on Cloudinary
  if (user.profilePhoto && user.profilePhoto.includes("cloudinary")) {
    const publicId = getPublicIdFromUrl(user.profilePhoto);
    if (!publicId) throw resError(400, "Failed to parse public ID!");
    await cloudinary.uploader.destroy(publicId);
  }

  // Custom file name
  const public_id = `/${user.username}_${Date.now()}`;

  // Upload new image
  const result = await cloudinary.uploader.upload(fileData.tempFilePath, {
    folder,
    public_id,
  });
  if (!result) throw resError(400, "Cloudinary upload failed!");
  await fs.unlink(fileData.tempFilePath);

  return result.secure_url;
};

export default uploadImage;
