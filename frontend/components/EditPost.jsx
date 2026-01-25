import { useState, useEffect } from "react";
import { getPostById, updatePost } from "../../frontend/src/Services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../../frontend/components/styling/EditPost.css";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const post = await getPostById(id);

        // Populate form with existing data
        setTitle(post.title || "");
        setLocation(post.location || "");
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err?.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting update for post ID:", id);
    console.log("Data:", { title, location });

    if (!title.trim() || !location.trim()) {
      setError("Both title and location are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const result = await updatePost(id, { title, location });
      console.log("Update result:", result);

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
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex-col">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            className="input-styling"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            style={{
              marginBottom: "5px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={saving}
            className="input-styling"
          />
        </div>

        <div className="d-flex">
          <button type="submit" disabled={saving} className="button-styling">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={saving}
            className="button-styling"
          >
            Cancel
          </button>
        </div>
      </form>

      {error && <div>{error}</div>}

      {success && (
        <div className="success-message">
          ✓ Post updated successfully! Redirecting...
        </div>
      )}
    </div>
  );
}

export default EditPost;
