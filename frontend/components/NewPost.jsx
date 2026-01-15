import { useState } from "react";
import { createPost } from "../../frontend/src/Services/api";

function NewPost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createNewPost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim()) {
      setError("Both title and location are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const newPost = await createPost({ title, location });

      console.log("Post created:", newPost);

      // Clear form after successful submission
      setTitle("");
      setLocation("");
      setSuccess(true);

      // Notify parent component if callback provided
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Post</h2>
      <form onSubmit={createNewPost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && (
        <div style={{ color: "green" }}>Post created successfully!</div>
      )}
    </div>
  );
}

export default NewPost;
