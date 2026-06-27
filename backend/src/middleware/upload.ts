import multer from "multer";

import { allowedImageMimeTypes, allowedVideoMimeTypes, mediaUploadLimits } from "../config/env";
import { HttpError } from "../utils/http-error";

export const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: mediaUploadLimits.videoBytes,
    files: 12,
  },
  fileFilter: (_req, file, cb) => {
    if (allowedImageMimeTypes.has(file.mimetype) || allowedVideoMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new HttpError(400, "Only JPEG, PNG, WebP, GIF images and MP4 videos are allowed"));
  },
});
