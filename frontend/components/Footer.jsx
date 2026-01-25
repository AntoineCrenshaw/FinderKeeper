import "../../frontend/components/styling/Footer.css";
const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-section">
            <h4>Shop and Learn</h4>
            <ul>
              <li>
                <a href="/browse">Browse Items</a>
              </li>
              <li>
                <a href="/categories">Categories</a>
              </li>
              <li>
                <a href="/new-arrivals">New Arrivals</a>
              </li>
              <li>
                <a href="/deals">Deals</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sell</h4>
            <ul>
              <li>
                <a href="/sell">Create Listing</a>
              </li>
              <li>
                <a href="/seller-guide">Seller Guide</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/tips">Selling Tips</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Account</h4>
            <ul>
              <li>
                <a href="/profile">Your Profile</a>
              </li>
              <li>
                <a href="/orders">Your Orders</a>
              </li>
              <li>
                <a href="/favorites">Saved Items</a>
              </li>
              <li>
                <a href="/settings">Settings</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/safety">Safety Tips</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
              <li>
                <a href="/press">Press</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p className="copyright">
              Copyright © 2024 MarketPlace Inc. All rights reserved.
            </p>
            <div className="legal-links">
              <a href="/privacy">Privacy Policy</a>
              <span className="separator">|</span>
              <a href="/terms">Terms of Use</a>
              <span className="separator">|</span>
              <a href="/cookies">Cookie Policy</a>
              <span className="separator">|</span>
              <a href="/accessibility">Accessibility</a>
            </div>
          </div>
          <div className="footer-location">
            <span>United States</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
