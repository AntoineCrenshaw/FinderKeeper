import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import ListPosts from "../../frontend/components/ListPosts";
import NewPost from "../../frontend/components/NewPost";
import PostDetails from "../../frontend/components/PostDetails";
import EditPost from "../../frontend/components/EditPost";
import ContactPage from "../../frontend/components/ContactPage";
import AboutPage from "../../frontend/components/AboutUsPage";
import Header from "../../frontend/components/Header";
import Footer from "../../frontend/components/Footer";
import DeleteConfirmation from "../../frontend/components/DeleteConfirmation";
import SignInForm from "../../frontend/components/SignInForm";
import RegisterUserForm from "../../frontend/components/RegisterUserForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";

function App() {
  const [auth, setAuth] = useState(null);

  function showSuccess(message) {
    toast(message, { type: "success", position: "bottom-right" });
  }

  function showError(message) {
    toast(message, { type: "error", position: "bottom-right" });
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      setAuth(auth);
    }
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  function onLogout() {
    setAuth(null);
    axios
      .post(`${API_URL}/users/logout`, {}, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        showSuccess("Logged out!");
        window.location.href = "/signin";
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.removeItem("auth");
  }

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <nav>
          <Header auth={auth} onLogout={onLogout} />
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <ListPosts
                showSuccess={showSuccess}
                showError={showError}
                setAuth={setAuth}
              />
            }
          />
          <Route
            path="/new"
            element={
              <NewPost showSuccess={showSuccess} showError={showError} />
            }
          />
          <Route path="/:id" element={<PostDetails />} />
          <Route path="/posts/update/:id" element={<EditPost />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/posts/delete/:id" element={<DeleteConfirmation />} />
          <Route
            path="/signin"
            element={
              <SignInForm
                showSuccess={showSuccess}
                showError={showError}
                setAuth={setAuth}
              />
            }
          />
          <Route path="/signup" element={<RegisterUserForm />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
