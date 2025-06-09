import express from "express";
const router = express.Router();

import resJson from "../utils/resJson";

const publicData = {
  status: true,
  message: "Success",
  result: {
    name: "K Khay",
  },
};

router.get("/", (req, res) => {
  resJson(res, 200, "Success", publicData);
});

export default router;
