import express from "express";
const router = express.Router();

import { ChatSchema } from "../utils/schema.js";
import createOrOpen from "../controllers/chat/createOrOpen.js";
import { validateBody, validateToken } from "../utils/validator.js";
import getAllChats from "../controllers/chat/getAllChats.js";
import createGroup from "../controllers/chat/createGroup.js";
import changeName from "../controllers/chat/changeName.js";
import addUsersToGroup from "../controllers/chat/addUsersToGroup.js";
import removeUserFromGroup from "../controllers/chat/removeUserFromGroup.js";
import addAdminsToGroup from "../controllers/chat/addAdminsToGroup.js";

router
  .route("/")
  .all(validateToken())
  .post(validateBody(ChatSchema.createOrOpen), createOrOpen)
  .get(getAllChats);

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

export default router;
