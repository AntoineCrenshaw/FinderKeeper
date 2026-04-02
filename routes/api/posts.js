import express from "express";

import debug from "debug";
const debugPostRouter = debug("app:post");
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
import {
  GetAllPosts,
  GetPostById,
  createPost,
  updatePost,
  deletePost,
} from "../../database.js";

// Configure storage for multer
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

router.use(express.urlencoded({ extended: false }));

//list all posts
router.get("/", async (req, res) => {
  debugPostRouter("post route hit");
  GetAllPosts()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
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

//upload images
router.post("/upload", (req, res, next) => {
  upload.array("images")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      debugPostRouter(`Multer error: ${err.code} - ${err.message}`);
      return res.status(400).json({ message: "Upload error: " + err.message });
    } else if (err) {
      debugPostRouter(`Upload error: ${err.message}`);
      return res.status(400).json({ message: "Upload error: " + err.message });
    }

    try {
      debugPostRouter(
        `Upload request received. Files: ${req.files ? req.files.length : 0}`,
      );

      if (!req.files || req.files.length === 0) {
        debugPostRouter("No files in upload request");
        return res.status(400).json({ message: "No files uploaded" });
      }

      const fileUrls = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
      }));

      // If postId is provided, update the post with image filenames
      const postId = req.query.postId;
      if (postId) {
        try {
          // Only update the images and lastUpdated fields
          await updatePost(postId, {
            images: req.files.map((f) => f.filename),
            lastUpdated: new Date(),
          });
          debugPostRouter(
            `Post ${postId} updated with ${req.files.length} images`,
          );
        } catch (dbErr) {
          console.error("Error updating post with images:", dbErr);
          // Still return success for upload, log the DB error
        }
      }

      debugPostRouter(
        `Images uploaded successfully: ${JSON.stringify(fileUrls)}`,
      );
      res.status(200).json({
        message: "Images uploaded successfully",
        files: fileUrls,
      });
    } catch (error) {
      debugPostRouter(`Error processing upload: ${error.message}`);
      console.error("Upload process error:", error);
      res.status(500).json({
        message: "Image upload processing failed",
        error: error.message,
      });
    }
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

//update Post
router.patch("/update/:postId", async (req, res) => {
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
