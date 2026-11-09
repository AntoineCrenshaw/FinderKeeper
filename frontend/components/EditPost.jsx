import { useState, useEffect } from "react";
import {
  uploadImages,
} from "../../frontend/src/Services/api";
import api from "../src/api";
import { useParams, useNavigate } from "react-router-dom";
import "../../frontend/components/styling/EditPost.css";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [zip, setZip] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [initialImages, setInitialImages] = useState([]);

  useEffect(() => {
  fetchPostById();
}, []);

    const fetchPostById = async () => {
      try {
        setLoading(true);
        setError(null);
        const post = await api.get(`/api/posts/${id}`)

        const existingImages = post.images || [];
        setInitialImages(existingImages);
        setTitle(post.data.title || "");
        setLocation(post.data.location || "");
        setZip(post.data.zip || "");
        setCategory(post.data.category || "");
        setDescription(post.data.description || "");
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err?.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
  

  const handleImageSelect = (e) => {
    const selectedFiles = e.target.files;
    setImages(selectedFiles);

    // Create previews
    const previews = [];
    let loadedCount = 0;
    for (let i = 0; i < selectedFiles.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push({
          id: `${Date.now()}-${i}`,
          src: event.target.result,
          name: selectedFiles[i].name,
        });
        loadedCount = loadedCount + 1;
        if (loadedCount === selectedFiles.length) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting update for post ID:", id);

    if (!title.trim() || !location.trim()) {
      setError("Both title and location are required");
      return;
    }

    if (!zip.trim()) {
      setError("ZIP code is required");
      return;
    }

    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const result = await api.get(`/api/posts/update/${id}` , {
        title,
        location,
        zip,
        category,
        description,
        images,
      });
      console.log("Update result:", result);

      // Upload images if provided
      if (images && images.length > 0) {
        try {
          const uploadResponse = await uploadImages(images, id);
          console.log("Upload response:", uploadResponse);
          console.log("Images uploaded successfully");
        } catch (uploadErr) {
          console.error("Error uploading images:", uploadErr);
          console.error("Upload error response:", uploadErr.response?.data);
          const errorMsg =
            uploadErr.response?.data?.message ||
            uploadErr.message ||
            "Unknown upload error";
          setError("Post updated but image upload failed: " + errorMsg);
          setSaving(false);
          return;
        }
      }

      // Clear images after successful submission
      setImages(null);
      setImagePreviews([]);

      // Reset file input
      const fileInput = document.getElementById("images");
      if (fileInput) {
        fileInput.value = "";
      }

      setSuccess(true);
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error config:", err.config); // This shows the actual URL being called
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update post";

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-style">Loading post...</div>;
  }

  if (error && !title && !location) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-post-page">
      <div className="form-container">
        <h2 className="form-title">Edit Post</h2>
        <form className="post-form" onSubmit={handleSubmit}>
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

            {initialImages && initialImages.length > 0 && (
              <div className="existing-images">
                <h3 className="existing-title">
                  Existing Images ({initialImages.length})
                </h3>
                <div className="existing-grid">
                  {initialImages.map((img, index) => (
                    <div key={index} className="existing-item">
                      <img
                        src={img}
                        alt={`Existing ${index}`}
                        className="existing-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={saving}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                id="zip"
                type="text"
                name="zip"
                placeholder="12345"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                disabled={saving}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={saving}
              className="form-input"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="books">Vehicles</option>
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
              onClick={() => navigate("/")}
              disabled={saving}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-submit">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && (
          <div className="success-message">
            ✓ Post updated successfully! Redirecting...
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPost;
