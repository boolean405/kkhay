import resError from "./resError.js";
import cloudinary from "../config/cloudinary.js";
import getPublicIdFromUrl from "./getPublicIdFromUrl.js";

export default async function uploadGroupPhoto(
  group = null,
  type,
  image,
  folder
) {
  try {
    // Validate type
    if (type !== "photo") throw resError(400, "Only photo are allowed!");

    // Get the current image URL dynamically
    const oldImageUrl = group ? group[type] : null;

    // Remove old image if it's hosted on Cloudinary
    if (oldImageUrl && oldImageUrl.includes("cloudinary")) {
      const publicId = getPublicIdFromUrl(oldImageUrl);
      if (!publicId) throw resError(400, "Failed to parse public ID!");
      await cloudinary.uploader.destroy(publicId);
    }

    // Custom file name
    const name = group ? group.name : "created_group";
    const public_id = `${name}_${type}_${Date.now()}`;

    // Upload new image
    const result = await cloudinary.uploader.upload(image, {
      folder,
      public_id,
    });
    if (!result) throw resError(400, "Cloudinary upload failed!");

    return result.secure_url;
  } catch (err) {
    throw resError(400, "Failed to upload image to Cloudinary");
  }
}
