import { useState, useEffect } from "react";
import { getPostById, updatePost } from "../../frontend/src/Services/api";
import { useParams, useNavigate } from "react-router-dom";

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

    if (!title.trim() || !location.trim()) {
      setError("Both title and location are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await updatePost(id, { title, location });

      setSuccess(true);

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err?.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Loading post...
      </div>
    );
  }

  if (error && !title && !location) {
    return (
      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
        <div
          style={{
            color: "red",
            padding: "15px",
            backgroundColor: "#ffebee",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#757575",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to My Posts
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Edit Post</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <label
            htmlFor="title"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="location"
            style={{
              display: "block",
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
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              backgroundColor: saving ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: "500",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              backgroundColor: "#757575",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            color: "red",
            marginTop: "15px",
            padding: "12px",
            backgroundColor: "#ffebee",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            color: "green",
            marginTop: "15px",
            padding: "12px",
            backgroundColor: "#e8f5e9",
            borderRadius: "5px",
          }}
        >
          ✓ Post updated successfully! Redirecting...
        </div>
      )}
    </div>
  );
}

export default EditPost;
