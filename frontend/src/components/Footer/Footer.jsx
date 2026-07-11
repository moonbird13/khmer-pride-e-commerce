import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="footer-block footer-block--brand">
          <h3>Khmer Pride</h3>
          <p>Discover trusted Cambodian-made essentials, fashion, and everyday favourites in one modern storefront.</p>
        </div>

        <div className="footer-block">
          <h4>Quick links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>

        <div className="footer-block">
          <h4>Customer service</h4>
          <ul>
            <li><Link to="/">Delivery & returns</Link></li>
            <li><Link to="/">Support center</Link></li>
            <li><Link to="/">Privacy policy</Link></li>
          </ul>
        </div>

        <div className="footer-block">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@khmerpride.com">hello@khmerpride.com</a></li>
            <li><a href="tel:+85512345678">+855 12 345 678</a></li>
            <li>Phnom Penh, Cambodia</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Khmer Pride. All rights reserved.</p>
      </div>
    </footer>
  );
}
