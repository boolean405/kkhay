import express from "express";
const router = express.Router();

import { ChatSchema } from "../utils/schema.js";
import createOrOpen from "../controllers/chat/createOrOpen.js";
import {
  validateBody,
  validateParam,
  validateToken,
} from "../utils/validator.js";
import createGroup from "../controllers/chat/createGroup.js";
import changeName from "../controllers/chat/changeName.js";
import addUsersToGroup from "../controllers/chat/addUsersToGroup.js";
import removeUserFromGroup from "../controllers/chat/removeUserFromGroup.js";
import addAdminsToGroup from "../controllers/chat/addAdminsToGroup.js";
import leaveGroup from "../controllers/chat/leaveGroup.js";
import deleteChat from "../controllers/chat/deleteChat.js";
import getPaginateChats from "../controllers/chat/getPaginateChats.js";

router.post(
  "/",
  validateToken(),
  validateBody(ChatSchema.createOrOpen),
  createOrOpen
);

router.get(
  "/paginate/:pageNum",
  validateToken(),
  validateParam(ChatSchema.params.pageNum, "pageNum"),
  getPaginateChats
);

router.post(
  "/create-group",
  validateToken(),
  validateBody(ChatSchema.createGroup),
  createGroup
);
router.patch(
  "/change-name",
  validateToken(),
  validateBody(ChatSchema.changeName),
  changeName
);
router.patch(
  "/add-users-to-group",
  validateToken(),
  validateBody(ChatSchema.addUsersToGroup),
  addUsersToGroup
);
router.patch(
  "/add-admins-to-group",
  validateToken(),
  validateBody(ChatSchema.addAdminsToGroup),
  addAdminsToGroup
);
router.patch(
  "/remove-users-from-group",
  validateToken(),
  validateBody(ChatSchema.removeUserFromGroup),
  removeUserFromGroup
);
router.patch(
  "/leave-group",
  validateToken(),
  validateBody(ChatSchema.leaveGroup),
  leaveGroup
);
router.patch(
  "/delete-chat",
  validateBody(ChatSchema.deleteChat),
  validateToken(),
  deleteChat
);

export default router;
