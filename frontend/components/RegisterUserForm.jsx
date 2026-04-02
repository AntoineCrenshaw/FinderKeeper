import { useState, useEffect } from "react";
import "../../frontend/components/styling/RegisterUserForm.css";
import { useNavigate } from "react-router-dom";
import { newUser } from "../src/Services/api";

function RegisterUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

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
    if (!email.trim() || !password.trim()) {
      setError("Both email and password are required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await newUser({ email, password });
      console.log("New user created: ", data);
      navigate("/");
      setSuccess("Successfully created user!");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="heading">Sign Up</div>
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
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <div className="invalid-feedback">
          Please enter a valid email address.
        </div>
        <input
          required
          className="input"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <div className="invalid-feedback">Please enter a valid password.</div>
        <span className="forgot-password">
          <a href="#">Forgot Password ?</a>
        </span>
        <span className="new-account">
          <a href="/signup">Already have an account? Sign in here</a>
        </span>

        <button className="login-button" type="submit" onClick={handleSubmit}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
    </div>
  );
}

export default RegisterUserForm;
