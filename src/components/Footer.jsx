import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const sponsors = [
    {
      id: 1,
      name: 'BarkBright Toys',
      logo: '/src/image/sponsors/Bark-Bright.png',
    },
    {
      id: 2,
      name: 'HealthyPaws Nutrition',
      logo: '/src/image/sponsors/HealthyPaws.png',
    },
    {
      id: 3,
      name: 'VetTech Innovations',
      logo: '/src/image/sponsors/vettech.png',
    },
  ];

  return (
    <footer className="footer  text-light py-4">
      <div className="container">
        <div className="row">
          {/* Навигация */}
          <div className="col-md-3 mb-3">
            <h5 className="text-uppercase">Навігація</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Головна</Link></li>
              <li><Link to="/services" className="text-light text-decoration-none">Послуги</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">Про нас</Link></li>
              <li><Link to="/contacts" className="text-light text-decoration-none">Контакти</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="col-md-3 mb-3">
            <h5 className="text-uppercase">Контакти</h5>
            <p><strong>Адреса:</strong> вул. Київська, 10, м. Київ, Україна</p>
            <p><strong>Телефон:</strong> +38 (012) 345-67-89</p>
            <p><strong>Email:</strong> info@onedogcenter.com</p>
          </div>

          {/* Соцсети */}
          <div className="col-md-3 mb-3 text-center">
            <h5 className="text-uppercase">Ми в соцмережах</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            </div>
          </div>

          {/* Спонсоры */}
          <div className="col-md-3 mb-3 text-center">
            <h5 className="text-uppercase">Наші спонсори</h5>
            <div className="d-flex justify-content-center gap-3">
              {sponsors.map((sponsor) => (
                <img
                  key={sponsor.id}
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="sponsor-logo"
                  title={sponsor.name}
                />
              ))}
            </div>
          </div>
        </div>

        <hr className="bg-light" />
        <div className="text-center">
          <p className="mb-0">&copy; 2024 OneDog. Усі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;