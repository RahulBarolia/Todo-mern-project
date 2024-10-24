import express from "express";
import dotenv from "dotenv";
import TodoRoutes from "./routes/todo.routes.js";
import path from "path";
import { connectDB } from "./config/db.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/todos", TodoRoutes);

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV.trim() === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on port 5000");
  connectDB();
});
