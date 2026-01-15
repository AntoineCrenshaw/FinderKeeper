import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListPosts from "../../frontend/components/ListPosts";
import NewPost from "../../frontend/components/NewPost";
import PostDetails from "../../frontend/components/PostDetails";
import EditPost from "../../frontend/components/EditPost";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <nav className="nav">
          <Link to="/">Home</Link> | <Link to="/new">New Post</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ListPosts />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/:id" element={<PostDetails />} />
          <Route path="/posts/update/:id" element={<EditPost />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
