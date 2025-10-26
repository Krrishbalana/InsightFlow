import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(), "public", "temp");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (
    (ext === ".csv" && mime === "text/csv") ||
    (ext === ".txt" && mime === "text/plain")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV or TXT files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
