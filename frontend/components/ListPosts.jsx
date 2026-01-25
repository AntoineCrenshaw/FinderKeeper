import { useState, useEffect } from "react";
import { getPosts, deletePost } from "../../frontend/src/Services/api";
import "../../frontend/components/styling/ListPost.css";

function ListPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
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
        {posts.map((post) => (
          <div key={post._id} className="card">
            <img
              src={post.image || "https://unsplash.it/400/300?random"}
              alt={post.title}
              className="card-image"
            />
            <div className="card-content">
              <h3 className="card-title">{post.title}</h3>
              <p className="card-location">📍 {post.location}</p>
              <div className="card-actions">
                <a href={`/posts/update/${post._id}`} className="card-link">
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="card-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ListPosts;
