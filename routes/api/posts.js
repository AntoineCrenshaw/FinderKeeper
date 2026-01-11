import express from "express";

import debug from "debug";
const debugPostRouter = debug("app:post");
import { ObjectId } from "mongodb";

const router = express.Router();
import {
  connectToDatabase,
  GetAllPosts,
  GetPostById,
  createPost,
  updatePost,
  deletePost,
  saveAuditLog,
} from "../../database.js";
router.use(express.urlencoded({ extended: false }));

//list all posts
router.get("/", async (req, res) => {
  debugPostRouter("list route hit");
  GetAllPosts()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

/* Get post by ID */
router.get("/:postId", async (req, res) => {
  const id = req.params.postId;
  debugPostRouter(`post by id route hit ${id}`);

  //find post by id
  const foundPostId = new ObjectId(id);
  const foundPost = await GetPostById(foundPostId);
  if (foundPost) {
    res.status(200).json(foundPost);
  } else {
    res.status(404).json({ error: "Post Not Found" });
  }
});

//create new post
router.post("/new", async (req, res) => {
  const post = req.body;
  post.createdDate = new Date();

  if (!post || !post.title || !post.location) {
    res.status(400).json({ message: "Invalid request" });
  } else {
    try {
      const result = await createPost(post);
      /*const log = {
        timestamp: new Date(),
        operation: "Add",
        collection: "Post",
      };
      await saveAuditLog(log); */
      res.status(200).json({ result, message: "New Post Added" });
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

//update Post
router.patch("/:postId", async (req, res) => {
  const postId = req.params.postId;

  //New Post data
  const updatedPost = req.body;

  //Search for post in DB
  const post = await GetPostById(new ObjectId(postId));
  debugPostRouter(`Post to update: ${JSON.stringify(post)}`);

  try {
    for (const key of Object.keys(updatedPost)) {
      post[key] = updatedPost[key];
      debugPostRouter(`Key: ${key}, Value: ${updatedPost[key]}`);
      post.lastUpdated = new Date();
    }

    const result = await updatePost(postId, post);
    res.status(200).json({ result, message: "Post Updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete Post
router.delete("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    const postToDelete = await GetPostById(new ObjectId(postId));
    if (!postToDelete) {
      return res.status(404).send("Post not found");
    }

    const result = await deletePost(postId);
    debugPostRouter(`Delete result: ${JSON.stringify(result)}`);

    if (result.deletedCount === 0) {
      res.status(404).send("Post not found");
    } else {
      res.status(200).json({ message: "Post Deleted" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router as PostRouter };
