import { useState } from "react";
import { createPost, uploadImages } from "../../frontend/src/Services/api";
import { useNavigate } from "react-router-dom";
import "../../frontend/components/styling/NewPost.css";

function NewPost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [zip, setZip] = useState("");
  const [images, setImages] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
        zip,
      });

      console.log("Post created:", newPost);
      const createdPostId = newPost.result._id || newPost.result.insertedId;

      // Upload images if provided
      if (images && images.length > 0) {
        try {
          const uploadResponse = await uploadImages(images, createdPostId);
          console.log("Upload response:", uploadResponse);
          console.log("Images uploaded successfully");
        } catch (uploadErr) {
          console.error("Error uploading images:", uploadErr);
          console.error("Upload error response:", uploadErr.response?.data);
          const errorMsg =
            uploadErr.response?.data?.message ||
            uploadErr.message ||
            "Unknown upload error";
          setError("Post created but image upload failed: " + errorMsg);
        }
      }

      // Clear form after successful submission
      setTitle("");
      setLocation("");
      setDescription("");
      setCategory("");
      setZip("");
      setImages(null);
      setImagePreviews([]);

      // Reset file input
      const fileInput = document.getElementById("images");
      if (fileInput) {
        fileInput.value = "";
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);

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

  const handleImageSelect = (e) => {
    const selectedFiles = e.target.files;
    setImages(selectedFiles);

    // Create previews
    const previews = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push({
          id: `${Date.now()}-${i}`,
          src: event.target.result,
          name: selectedFiles[i].name,
        });
        if (previews.length === selectedFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(selectedFiles[i]);
    }
  };

  const removeImagePreview = (previewId) => {
    const updatedPreviews = imagePreviews.filter((img) => img.id !== previewId);
    setImagePreviews(updatedPreviews);

    // Update the files list
    if (images) {
      const fileName = imagePreviews.find((img) => img.id === previewId)?.name;
      const dataTransfer = new DataTransfer();

      for (let i = 0; i < images.length; i++) {
        if (images[i].name !== fileName) {
          dataTransfer.items.add(images[i]);
        }
      }

      const fileInput = document.getElementById("images");
      fileInput.files = dataTransfer.files;
      setImages(dataTransfer.files);
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
              onChange={handleImageSelect}
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

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              <h3 className="previews-title">
                Selected Images ({imagePreviews.length})
              </h3>
              <div className="previews-grid">
                {imagePreviews.map((preview) => (
                  <div key={preview.id} className="preview-item">
                    <img
                      src={preview.src}
                      alt={preview.name}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="delete-preview-btn"
                      onClick={() => removeImagePreview(preview.id)}
                      title="Delete this image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <form className="post-form" onSubmit={NewPostEntry}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title here to describe your items for sale"
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
            <div className="form-group">
              <label htmlFor="zip">Zip Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                disabled={loading}
                placeholder="12345"
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
              placeholder="Describe your items for sale in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="form-textarea"
              rows="6"
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/")}
            >
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
