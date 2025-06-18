import path from "path";
import express from "express";
import { fileURLToPath } from "url";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/logo", (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/images/logo.png"));
});

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/images/verified.png"));
});

router.get("/profile-photo", (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/images/profile_photo.jpg"));
});

export default router;
