import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import '../styles/Contacts.css';

const Contacts = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        document.title = 'Контакти';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                timestamp: new Date().toISOString(),
            });
            setSuccessMessage('Ваше повідомлення успішно надіслано!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Помилка при відправці повідомлення:', error);
            setSuccessMessage('Помилка. Спробуйте ще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container py-5">
            <h2 className="text-primary mb-4">Контакти</h2>
            <div className="row">
                <div className="col-md-6">
                    <h4 className="mb-3">Зв'яжіться з нами</h4>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
                            <a href="tel:+380123456789" className="text-decoration-none text-dark">
                                +38 (012) 345-67-89
                            </a>
                        </li>
                        <li className="mb-3">
                            <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                            <a href="mailto:info@onedogcenter.com" className="text-decoration-none text-dark">
                                info@onedogcenter.com
                            </a>
                        </li>
                        <li className="mb-3">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                            вул. Київська, 10, м. Київ, Україна
                        </li>
                    </ul>
                    <div className="social-icons mt-4">
                        <h5 className="mb-3">Ми в соціальних мережах:</h5>
                        <a href="https://www.facebook.com" className="me-3 text-primary" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} size="2x" />
                        </a>
                        <a href="https://www.instagram.com" className="me-3 text-danger" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} size="2x" />
                        </a>
                        <a href="https://www.twitter.com" className="me-3 text-info" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} size="2x" />
                        </a>
                    </div>
                </div>
                <div className="col-md-6 rounded-4 mt-sm-2 alertBlock">
                    <h4 className="mb-3">Напишіть нам</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Ім'я</label><input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Електронна пошта</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3 ">
                            <label htmlFor="message" className="form-label">Повідомлення</label>
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Надсилання...' : 'Надіслати'}
                        </button>
                        {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
                    </form>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <h4 className="mb-4 text-primary">Наше місцезнаходження:</h4>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2539.192260994769!2d30.523635116012787!3d50.45008397947574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce58d2d7ad43%3A0x400c723d19c2b1e8!2z0JrQuNGX0LIsINCc0L7QtNC90L7QstCw0L3Qviwg0JrQuNGX0LIg0JHQtdCw0LvRjNGI0L3QsNGPINC60LvRjtC90LjQtSAxMDAsINCc0L7QtNC90YLRgA!5e0!3m2!1suk!2sua!4v1692616842874!5m2!1suk!2sua"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Contacts;