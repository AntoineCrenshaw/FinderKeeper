import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListPosts from "../../frontend/components/ListPosts";
import NewPost from "../../frontend/components/NewPost";
import PostDetails from "../../frontend/components/PostDetails";
import EditPost from "../../frontend/components/EditPost";
import ContactPage from "../../frontend/components/ContactPage";
import AboutPage from "../../frontend/components/AboutUsPage";
import Header from "../../frontend/components/Header";
import Footer from "../../frontend/components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <nav>
        <Header />
      </nav>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListPosts />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/:id" element={<PostDetails />} />
          <Route path="/posts/update/:id" element={<EditPost />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
