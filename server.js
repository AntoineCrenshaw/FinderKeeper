import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import debug from "debug";
const debugServer = debug("app:server");

import { PostRouter } from "./routes/api/posts.js";

const app = express();

app.use(
  cors({
    origin: true, // Adjust according to your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/posts", PostRouter);
app.get("/", (req, res) => {
  res.send("Welcome to my home page.");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  debugServer(`Listening on port http://localhost:${port}`);
});
