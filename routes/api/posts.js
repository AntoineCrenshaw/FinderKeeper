import express from "express";

import debug from "debug";
const debugPostRouter = debug("app:post");

const router = express.Router();
import { connectToDatabase, GetAllPosts, GetPostById } from "../../database.js";
router.use(express.urlencoded({ extended: false }));

router.get("/list", async (req, res) => {
  debugPostRouter("list route hit");
  const db = connectToDatabase();
  const posts = await GetAllPosts();
  res.json(posts);
});

/* Get post by ID */
router.get("/:postId", async (req, res) => {
  const id = req.params.postId;
  debugPostRouter(`post by id route hit ${id}`);

  //find post by id
  const foundPostId = new ObjectId(id);
  const foundPost = GetPostById(foundPostId);
  if (foundPost) {
    res.json(foundPost);
  } else {
    res.status(404).json({ error: "Post Not Found" });
  }
});

export { router as PostRouter };
