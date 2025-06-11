import Joi from "joi";

export const UserSchema = {
  register: Joi.object({
    name: Joi.string()
      .pattern(/^[\p{L}\s]+$/u)
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
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{5,30}$'))
      .required(),
  }),

  login: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{5,30}$'))
      .required(),
  }),

  changeName: Joi.object({
    name: Joi.string()
      .pattern(/^[\p{L}\s]+$/u)
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
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{5,30}$'))
      .required(),
    newPassword: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{5,30}$'))
      .required(),
  }),

  deleteAccount: Joi.object({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{5,30}$'))
      .required(),
  }),

  verify: Joi.object({
    code: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  }),

  uploadPhoto: Joi.object({
    profilePhoto: Joi.string(),
    coverPhoto: Joi.string(),
  }),

  editProfile: Joi.object({
    name: Joi.string()
      .pattern(/^[\p{L}\p{M}\s]+$/u)
      .min(1)
      .max(20),
    username: Joi.string()
      .pattern(/^[a-z0-9]+$/)
      .min(5)
      .max(20),
    profilePhoto: Joi.string(),
    coverPhoto: Joi.string(),
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

  params: {
    userId: Joi.object({
      userId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};

export const MessageSchema = {
  message: Joi.object({
    sender: Joi.string().length(24).hex().required(),
    receiver: Joi.string().length(24).hex().required(),
    type: Joi.string().valid("text", "image", "video").required(),
    content: Joi.string().min(1).required(),
  }),
};
