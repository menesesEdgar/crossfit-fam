import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import sharp from "sharp";

const BASE_PATH = "src/uploads/profile/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(BASE_PATH)) {
      fs.mkdirSync(BASE_PATH, { recursive: true });
    }
    cb(null, BASE_PATH);
  },
  filename: (req, file, cb) => {
    const name = v4();
    cb(null, name + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const saveProfileImage = async (req, res, next) => {
  const file = req.file || null;
  try {
    if (!file) {
      next();
    } else {
      const { mimetype, filename } = file;
      const fileName = path.parse(filename).name;

      const thumbnailDir = path.join(BASE_PATH, "thumbnails");

      const thumbnailPath = path.join(
        thumbnailDir,
        `${fileName}-thumbnail${path.extname(filename)}`
      );

      // Crear directorios si no existen
      if (!fs.existsSync(thumbnailDir))
        fs.mkdirSync(thumbnailDir, { recursive: true });

      await sharp(file.path).resize(150, 150).toFile(thumbnailPath);

      const urlRelativePath = path.relative(
        "src",
        path.join(BASE_PATH, filename)
      );
      const thumbnailRelativePath = path.relative("src", thumbnailPath);

      req.profileImage = {
        url: urlRelativePath,
        type: mimetype,
        metadata: { ...file },
        thumbnail: thumbnailRelativePath,
      };

      next();
    }
  } catch (error) {
    console.error("Error processing profile image:", error);
    return res.status(500).json({ message: "Error processing profile image" });
  }
};

export { upload, saveProfileImage };
