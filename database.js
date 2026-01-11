import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import debug from "debug";
const debugDb = debug("app:database");

let _db = null;

async function connectToDatabase() {
  if (!_db) {
    const connectionString = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
  }
  debugDb("Connected to Database");
  return _db;
}

async function ping() {
  const db = await connectToDatabase();
  const pong = await db.command({ ping: 1 });
  debugDb(`Ping:, ${JSON.stringify(pong)}`);
}

async function GetAllPosts() {
  const db = await connectToDatabase();
  const posts = await db.collection("Posts").find().toArray();
  console.log(posts);
  return posts;
}

async function GetPostById(postId) {
  const db = await connectToDatabase();
  const getPost = await db.collection("Posts").findOne({ _id: postId });
  return getPost;
}

async function createPost(post) {
  const db = await connectToDatabase();
  const dbResult = await db.collection("Posts").insertOne(post);
  return dbResult;
}

async function updatePost(postId, updatedPost) {
  const db = await connectToDatabase();
  debugDb(`Updated post: ${JSON.stringify(updatedPost)}`);
  const dbResult = await db
    .collection("Posts")
    .updateOne({ _id: new ObjectId(postId) }, { $set: updatedPost });
  return dbResult;
}

async function deletePost(postId) {
  const db = await connectToDatabase();
  const dbResult = await db
    .collection("Posts")
    .deleteOne({ _id: new ObjectId(postId) });
  return dbResult;
}

async function saveAuditLog(log) {
  const db = await connectToDatabase();
  const dbResult = await db.collection("AuditLog").instertOne(log);
  return dbResult;
}

ping();

export {
  connectToDatabase,
  ping,
  GetAllPosts,
  GetPostById,
  createPost,
  updatePost,
  deletePost,
  saveAuditLog,
};
