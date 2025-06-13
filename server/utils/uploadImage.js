import cloudinary from "../config/cloudinary";
import getPublicIdFromUrl from "./getPublicIdFromUrl";

const uploadImage = async (oldUrl, fileData, folder) => {
  // Remove old image if exists and is hosted on Cloudinary
  if (oldUrl && oldUrl.includes("cloudinary")) {
    const publicId = getPublicIdFromUrl(oldUrl);
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
  return result.secure_url;
};

export default uploadImage;
