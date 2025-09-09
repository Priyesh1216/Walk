import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

app.get("/config", (_req, res) => {
  res.json({ mapsKey: process.env.GOOGLE_MAPS_API_KEY || "" });
});

app.listen(PORT, () => {
  console.log(`Local Explorer server running at http://localhost:${PORT}`);
});
