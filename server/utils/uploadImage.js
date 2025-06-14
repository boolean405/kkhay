import resError from "./resError.js";
import cloudinary from "../config/cloudinary.js";
import getPublicIdFromUrl from "./getPublicIdFromUrl.js";

const uploadImage = async (user, type, image, folder) => {
  try {
    // Validate type
    if (type !== "profilePhoto" && type !== "coverPhoto") {
      throw resError(400, "Only profilePhoto and coverPhoto are allowed!");
    }

    // Get the current image URL dynamically
    const oldImageUrl = user[type];

    // Remove old image if it's hosted on Cloudinary
    if (oldImageUrl && oldImageUrl.includes("cloudinary")) {
      const publicId = getPublicIdFromUrl(oldImageUrl);
      if (!publicId) throw resError(400, "Failed to parse public ID!");
      await cloudinary.uploader.destroy(publicId);
    }

    // Custom file name
    const public_id = `${user.username}_${Date.now()}`;

    // Upload new image
    const result = await cloudinary.uploader.upload(image, {
      folder,
      public_id,
    });
    console.log(result.secure_url);
    if (!result) throw resError(400, "Cloudinary upload failed!");

    return result.secure_url;
  } catch (err) {
    throw resError(400, err.message);
  }
};

export default uploadImage;

// import fs from "fs/promises";
// import cloudinary from "../config/cloudinary.js";
// import getPublicIdFromUrl from "./getPublicIdFromUrl.js";

// const uploadImage = async (user, fileData, folder) => {
//   // Remove old image if exists and is hosted on Cloudinary
//   if (user.profilePhoto && user.profilePhoto.includes("cloudinary")) {
//     const publicId = getPublicIdFromUrl(user.profilePhoto);
//     if (!publicId) throw resError(400, "Failed to parse public ID!");
//     await cloudinary.uploader.destroy(publicId);
//   }

//   // Custom file name
//   const public_id = `/${user.username}_${Date.now()}`;

//   // Upload new image
//   const result = await cloudinary.uploader.upload(fileData.tempFilePath, {
//     folder,
//     public_id,
//   });
//   if (!result) throw resError(400, "Cloudinary upload failed!");
//   await fs.unlink(fileData.tempFilePath);

//   return result.secure_url;
// };

// export default uploadImage;
