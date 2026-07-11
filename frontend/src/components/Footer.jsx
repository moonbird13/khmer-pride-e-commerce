import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-block">
          <h3>Khmer Pride</h3>
          <p>Discover trusted Cambodian-made essentials, fashion, and everyday favourites in one modern storefront.</p>
        </div>

        <div className="footer-block">
          <h4>Quick links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
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
            <li>hello@khmerpride.com</li>
            <li>+855 12 345 678</li>
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
