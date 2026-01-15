import { useState, useEffect } from "react";
import { getPostById } from "../src/Services/api";
import { useParams, useNavigate } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err?.message || "Failed to fetch post details");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div>
      <form>
        <h2>Post Details</h2>
        <input type="text" value={post.title} readOnly />
        <input type="text" value={post.location} readOnly />
        <button onClick={() => navigate(`/posts/update/${id}`)}>
          Edit Post
        </button>
        <button onClick={() => navigate("/posts")}>Back to Posts</button>
      </form>
    </div>
  );
}

export default PostDetails;
