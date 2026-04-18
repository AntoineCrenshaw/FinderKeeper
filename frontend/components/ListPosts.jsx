import { useState, useEffect } from "react";
import { getPosts, deletePost } from "../../frontend/src/Services/api";
import "../../frontend/components/styling/ListPost.css";
import DeleteConfirmation from "../../frontend/components/DeleteConfirmation";

function ListPosts({ showSuccess }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const openDeleteModal = (id) => {
    setShowModal(true);
    setPostToDelete(id);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setPostToDelete(null);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      console.log("Fetched posts:", data);
      setPosts(data);
      //showSuccess("Posts loaded successfully");
    } catch (err) {
      console.error("fetchPosts error", err);
      setError(err.response?.data?.message || err.message || "Unknown");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
      //showSuccess("Post deleted successfully!");
      closeDeleteModal();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>Active Sales</h1>
      </div>
      <div className="grid-container">
        {posts.map((post) => {
          // Get the first image or use a placeholder
          const imageUrl =
            post.images && post.images.length > 0
              ? `${import.meta.env.VITE_API_URL}/uploads/${post.images[0]}`
              : "https://unsplash.it/400/300?random";

          return (
            <div key={post._id} className="card">
              <img src={imageUrl} alt={post.title} className="card-image" />
              <div className="card-content">
                <h3 className="card-title">{post.title}</h3>
                <p className="card-location">📍 {post.location}</p>
                <div className="card-actions">
                  <a href={`/posts/update/${post._id}`} className="card-link">
                    Edit
                  </a>
                  <button
                    onClick={() => openDeleteModal(post._id)}
                    className="card-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <DeleteConfirmation
          handleDelete={handleDelete}
          postId={postToDelete}
          onClose={() => closeDeleteModal()}
        />
      )}
    </>
  );
}

export default ListPosts;
