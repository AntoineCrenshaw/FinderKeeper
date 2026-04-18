import { NavLink } from "react-router-dom";
import "../../frontend/components/styling/Header.css";
const Header = ({ auth, onLogout }) => {
  const onClickLogout = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    onLogout();
  };
  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <NavLink to="/" className="logo">
            <span className="logo-text">FinderKeeper</span>
          </NavLink>
          {auth ? (
            <>
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
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Welcome {auth.email}
                </NavLink>
                <button
                  type="button"
                  className="nav-link"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </nav>
            </>
          ) : (
            <div className="header-actions">
              <button className="si-button">
                <NavLink to="/signin">Sign In</NavLink>
              </button>
              <button className="su-button">
                <NavLink to="/signup">Sign Up</NavLink>
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
