import express from "express";
const router = express.Router();

import resJson from "../utils/resJson.js";

const publicData = {
  status: true,
  message: "Success",
  result: {
    name: "Success get public data",
  },
};

router.get("/", (req, res) => {
  resJson(res, 200, "Success", publicData);
});

export default router;
