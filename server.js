import * as dotenv from "dotenv";
dotenv.config();
console.log("Environment loaded, starting server...");

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "@merlin4/express-auth";
import cookieParser from "cookie-parser";

import debug from "debug";
const debugServer = debug("app:server");

import { PostRouter } from "./routes/api/posts.js";
import { UserRouter } from "./routes/api/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: true, // Adjust according to your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(
//authMiddleware(process.env.JWT_SECRET, "authToken", {
//httpOnly: true,
// maxAge: 1000 * 60 * 60,
//}),
//);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/posts", PostRouter);
app.use("/api/users", UserRouter);
app.get("/", (req, res) => {
  res.send("Welcome to my home page.");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  debugServer(`Listening on port http://localhost:${port}`);
});

//handle server exceptions to keep my server from crashing
app.use((err, req, res, next) => {
  res.status(err.status).json({ error: err.message });
});
