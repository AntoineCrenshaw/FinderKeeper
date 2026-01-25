import "../../frontend/components/styling/Header.css";
const Header = () => {
  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <a href="/" className="logo">
            <span className="logo-text">FinderKeeper</span>
          </a>
          <nav className="nav-menu">
            <a href="/" className="nav-link active">
              Home
            </a>
            <a href="/new" className="nav-link">
              Sell
            </a>
            <a href="/contact" className="nav-link">
              Contact
            </a>
            <a href="/about" className="nav-link">
              About
            </a>
          </nav>
          <div className="header-actions">
            <button className="btn-secondary">Sign In</button>
            <button className="btn-primary">Sign Up</button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
