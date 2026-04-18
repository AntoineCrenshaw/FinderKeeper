import { useState, useEffect } from "react";
import "../../frontend/components/styling/SignInForm.css";
import { useNavigate } from "react-router-dom";
import { userSignIn } from "../src/Services/api";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function SignInForm({ showSuccess, showError, setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (() => {
      "use strict";
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll(".needs-validation");

      // Loop over them and prevent submission
      Array.from(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          (event) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }

            form.classList.add("was-validated");
          },
          false,
        );
      });
    })();
  }, []); // Run only once when the component loads

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for empty fields
    try {
      const response = await userSignIn(
        { email, password },
        { withCredentials: true },
      );
      console.log("User signed in: ", response);

      showSuccess(response.message || "Successfully logged in!");
      setAuth(response);
      localStorage.setItem("auth", JSON.stringify(response)); // Save auth to local storage
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid username or password";
      showError(message);
      console.log(message);
    }
  };
  return (
    <div className="container">
      <div className="heading">Sign In</div>
      <form
        action=""
        className="form needs-validation"
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          required
          className="input"
          type="email"
          name="email"
          id="email"
          aria-describedby="email-addon"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="invalid-feedback">
          Please enter a valid email address.
        </div>
        <span className="input-grout-text" id="password-addon">
          <i className="bi bi-lock-fill input-icon"></i>
        </span>
        <input
          required
          minLength={5}
          className="input"
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="input-group-text"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i
            className={`input-icon bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
          ></i>
        </span>

        <div className="invalid-feedback">
          Please enter a password at least 5 characters long.
        </div>
        <span className="forgot-password">
          <a href="#">Forgot Password ?</a>
        </span>
        <span className="new-account">
          <a href="/signup">Need an account? Sign up here!</a>
        </span>

        <button className="login-button" type="submit" onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
