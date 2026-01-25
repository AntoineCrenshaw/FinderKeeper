import { useState } from "react";
import { createPost } from "../../frontend/src/Services/api";
import "../../frontend/components/styling/NewPost.css";

function NewPost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const NewPostEntry = async (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim()) {
      setError("Both title and location are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const newPost = await createPost({
        title,
        location,
        description,
        category,
      });

      console.log("Post created:", newPost);

      // Clear form after successful submission
      setTitle("");
      setLocation("");
      setDescription("");
      setCategory("");
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

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="new-post-page">
      <div className="form-container">
        <h1 className="form-title">Create New Post</h1>
        <p className="form-subtitle">
          Fill in the details below to list your items for sale.
        </p>

        <form className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                placeholder="City, State"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="vehicles">Vehicles</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your item in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="form-textarea"
              rows="6"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="images">Images</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                className="file-input"
              />
              <div className="file-upload-label">
                <svg
                  className="upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="upload-text">Click to upload images</span>
                <span className="upload-subtext">PNG, JPG up to 10MB</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && (
          <div style={{ color: "green" }}>Post created successfully!</div>
        )}
      </div>
    </div>
  );
}

export default NewPost;
