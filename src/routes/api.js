import express from "express";
import multer from "multer";

import * as documentController from "../controllers/documentController.js";
import { validateFileUploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/test", (req, res) => {
  res.send({ test: "Its  a test" });
});

router.post(
  "/upload",
  upload.single("document"),
  validateFileUploadMiddleware,
  documentController.uploadDocument
);

router.post("/question", documentController.askQuestion);

export default router;
