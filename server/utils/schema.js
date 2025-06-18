import Joi from "joi";

export const UserSchema = {
  register: Joi.object({
    name: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .min(1)
      .max(20)
      .required(),
    username: Joi.string()
      .pattern(/^[a-z0-9]+$/)
      .min(5)
      .max(20)
      .required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{8,30}$'))
      .required(),
  }),

  login: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{8,30}$'))
      .required(),
  }),

  changeName: Joi.object({
    name: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .min(1)
      .max(20)
      .required(),
  }),

  changeUsername: Joi.object({
    username: Joi.string()
      .pattern(/^[a-z0-9]+$/)
      .min(5)
      .max(20)
      .required(),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{8,30}$'))
      .required(),
    newPassword: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{8,30}$'))
      .required(),
  }),

  deleteAccount: Joi.object({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{8,30}$'))
      .required(),
  }),

  registerVerify: Joi.object({
    code: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  }),

  uploadPhoto: Joi.object({
    profilePhoto: Joi.string(),
    coverPhoto: Joi.string(),
  }),

  deletePhoto: Joi.object({
    profilePhoto: Joi.string(),
    coverPhoto: Joi.string(),
  }),

  changeNames: Joi.object({
    name: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .min(1)
      .max(20),
    username: Joi.string()
      .pattern(/^[a-z0-9]+$/)
      .min(5)
      .max(20),
  }),

  existEmail: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  }),

  existUsername: Joi.object({
    username: Joi.string()
      .pattern(/^[a-z0-9]+$/)
      .min(5)
      .max(20)
      .required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  }),

  forgotPasswordVerify: Joi.object({
    code: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  }),

  params: {
    userId: Joi.object({
      userId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },

  resetPassword: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    newPassword: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{8,30}$'))
      .required(),
  }),
  search: Joi.object({
    search: Joi.string().required(),
  }),
};

export const ChatSchema = {
  createOrOpen: Joi.object({
    receiverId: Joi.string().length(24).hex().required(),
  }),
  createGroup: Joi.object({
    name: Joi.string().min(1).max(20).required(),
    userIds: Joi.array()
      .items(Joi.string().length(24).hex().required())
      .min(1)
      .required(),
  }),
  changeName: Joi.object({
    name: Joi.string().min(1).max(20).required(),
    chatId: Joi.string().length(24).hex().required(),
  }),
  addUsersToGroup: Joi.object({
    groupId: Joi.string().length(24).hex().required(),
    userIds: Joi.array()
      .items(Joi.string().length(24).hex().required())
      .min(1)
      .required(),
  }),
  addAdminsToGroup: Joi.object({
    groupId: Joi.string().length(24).hex().required(),
    userIds: Joi.array()
      .items(Joi.string().length(24).hex().required())
      .min(1)
      .required(),
  }),
  removeUserFromGroup: Joi.object({
    groupId: Joi.string().length(24).hex().required(),
    userId: Joi.string().length(24).hex().required(),
  }),
};

export const MessageSchema = {
  message: Joi.object({
    sender: Joi.string().length(24).hex().required(),
    receiver: Joi.string().length(24).hex().required(),
    type: Joi.string().valid("text", "image", "video").required(),
    content: Joi.string().min(1).required(),
  }),
};
