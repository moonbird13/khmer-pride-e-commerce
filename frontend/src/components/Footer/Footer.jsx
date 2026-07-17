import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__grid">
          <div className="footer-block">
            <h3>Khmer Pride</h3>
            <p>Discover authentic Cambodian-made essentials, fashion, and everyday favorites in one modern storefront. Supporting local makers and Khmer culture.</p>
          </div>

          <div className="footer-block">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
            </ul>
          </div>

          <div className="footer-block">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-block">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@khmerpride.com">hello@khmerpride.com</a></li>
              <li><a href="tel:+85512345678">+855 (12) 345-678</a></li>
              <li>Phnom Penh, Cambodia</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Khmer Pride. All rights reserved. Made with pride in Cambodia.</p>
        </div>
      </div>
    </footer>
  );
}
