import { useState, useEffect } from "react";
import { getPosts, deletePost } from "../../frontend/src/Services/api";
import { Link } from "react-router-dom";

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
    <div>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.location}</p>
          <a className="btn">
            <Link to={`/posts/update/${post._id}`}>Edit</Link>
          </a>
          <button className="px-3" onClick={() => handleDelete(post._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ListPosts;
