import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import wodRoutes from "./routes/wodRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import athletesRoutes from "./routes/athletesRoutes.js";
dotenv.config();

const app = express();
const APP_URL = process.env.APP_URL || "http://localhost:5173";

console.log("APP_URL", APP_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors([APP_URL]));
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wods", wodRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/athletes", athletesRoutes);
// app.use("/api/permissions", permissionRoutes);
// app.use("/api/roles", roleRoutes);
// app.use("/api/role-permissions", rolePermissionRoutes);
// app.use("/api/ping", pingRoutes);
// app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
