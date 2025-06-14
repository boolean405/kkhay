import Token from "../../utils/token.js";
import UserDB from "../../models/user.js";
import resJson from "../../utils/resJson.js";
import resError from "../../utils/resError.js";
import uploadImage from "../../utils/uploadImage.js";

const uploadPhoto = async (req, res, next) => {
  try {
    const userId = req.userId;
    const body = req.body;
    if (!body) throw resError(400, "Photo is required to upload!");

    const coverPhoto = body.coverPhoto;
    const profilePhoto = body.profilePhoto;

    const user = await UserDB.findById(userId);
    if (!user) throw resError(404, "User not found!");

    const editedUser = {};

    if (profilePhoto) {
      editedUser.profilePhoto = await uploadImage(
        user,
        "profilePhoto",
        profilePhoto,
        "kkhay/users/profilephoto"
      );
    }
    if (coverPhoto) {
      editedUser.coverPhoto = await uploadImage(
        user,
        "coverPhoto",
        coverPhoto,
        "kkhay/users/coverphoto"
      );
    }

    const updatedUser = await UserDB.findByIdAndUpdate(user._id, editedUser, {
      new: true,
      select: "-password",
    });

    const accessToken = Token.makeAccessToken({
      id: updatedUser._id.toString(),
    });
    resJson(res, 200, "Success upload photo.", {
      user: updatedUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default uploadPhoto;

// import Token from "../../utils/token.js";
// import UserDB from "../../models/user.js";
// import resJson from "../../utils/resJson.js";
// import resError from "../../utils/resError.js";
// import uploadImage from "../../utils/uploadImage.js";

// const uploadPhoto = async (req, res, next) => {
//   try {
//     const userId = req.userId;

//     const files = req.files;
//     if (!files) throw resError(400, "Photo is required to upload!");

//     const coverPhoto = files.coverPhoto;
//     const profilePhoto = files.profilePhoto;

//     const user = await UserDB.findById(userId);
//     if (!user) throw resError(404, "User not found!");

//     const editedUser = {};

//     if (profilePhoto) {
//       editedUser.profilePhoto = await uploadImage(
//         user,
//         profilePhoto,
//         "kkhay/users/profilephoto"
//       );
//     }
//     if (coverPhoto) {
//       editedUser.coverPhoto = await uploadImage(
//         user,
//         coverPhoto,
//         "kkhay/users/coverphoto"
//       );
//     }

//     await UserDB.findByIdAndUpdate(user._id, editedUser);
//     const updatedUser = await UserDB.findById(user._id).select("-password");
//     const accessToken = Token.makeAccessToken({
//       id: updatedUser._id.toString(),
//     });
//     resJson(res, 200, "Success upload photo", {
//       user: updatedUser,
//       accessToken,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export default uploadPhoto;
