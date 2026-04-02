import { NavLink } from "react-router-dom";
import "../../frontend/components/styling/Header.css";
const Header = () => {
  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <NavLink to="/" className="logo">
            <span className="logo-text">FinderKeeper</span>
          </NavLink>
          <nav className="nav-menu">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/new"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Sell
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              About
            </NavLink>
            <div className="header-actions">
              <button className="si-button">
                <NavLink to="/signin">Sign In</NavLink>
              </button>
              <button className="su-button">
                <NavLink to="/signup">Sign Up</NavLink>
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
