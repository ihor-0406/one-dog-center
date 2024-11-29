import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import "bootstrap/dist/css/bootstrap.min.css"; // Подключение CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Подключение JS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { faPaw, faUser, faMagnifyingGlass, faBell, faTrash,faHouse , faFlask, faHouseChimneyMedical, faHeadset, faHeart } from '@fortawesome/free-solid-svg-icons';
import '../styles/header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef(null);
    const navigate = useNavigate();

    // Firebase коллекция уведомлений
    const notificationsCollection = collection(db, 'notifications');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setIsLoggedIn(!!user);
            if (user) {
                // Проверяем, не было ли уже уведомления о входе
                const hasLoggedInNotification = localStorage.getItem('loggedInNotification');
                if (!hasLoggedInNotification) {
                    await addNotification('Ви успішно увійшли в систему');
                    // Помечаем, что уведомление уже было отправлено
                    localStorage.setItem('loggedInNotification', 'true');
                }
            } else {
                // Убираем флаг, если пользователь вышел
                localStorage.removeItem('loggedInNotification');
            }
        });
    
        const unsubscribeNotifications = onSnapshot(notificationsCollection, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotifications(fetchedNotifications);
        });
    
        return () => {
            unsubscribe();
            unsubscribeNotifications();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNotificationsOpen]);

    const addNotification = async (message) => {
        try {
            await addDoc(notificationsCollection, {
                message,
                isRead: false,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Помилка під час додаванні повідомлення:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const notificationDoc = doc(db, 'notifications', id);
            await updateDoc(notificationDoc, { isRead: true });
        } catch (error) {
            console.error('Помилка під час оновлення повідомлення:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const notificationDoc = doc(db, 'notifications', id);
            await deleteDoc(notificationDoc);
        } catch (error) {
            console.error('Помилка під час видалення повідомлення:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            addNotification('Ви вийшли із системи');
            localStorage.clear();
            sessionStorage.clear();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Помилка під час виходу:', error);
        }
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        setSearchResults([]); // Скидуємо панель пошука
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
            const results = [];
            contentElements.forEach((element) => {
                if (element.textContent.toLowerCase().includes(searchQuery.toLowerCase())) {
                    results.push(element.textContent);
                }
            });
            setSearchResults(results);
        }
    };

    return (
        <>
            <header className="container header">
                <nav className="row d-flex justify-content-between align-items-center">
                    {/* Меню */}
                    <Navbar bg="light" expand={false} className="col-1 ms-3 ">
            <Navbar.Toggle
                aria-controls="offcanvasNavbar"
                className="border-0 bg-transparent p-1 rounded-circle iconMenu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="black"
                    className="bi bi-list "
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                    ></path>
                </svg>
            </Navbar.Toggle>
            <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="start"
                className="menuBox"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">
                        <Link className="navbar-brand text-dark " to="/">
                            <h2 className="poppins-semibold fw-medium logoOnegog">
                                One
                                <span className="fw-bolder">
                                    D
                                    <FontAwesomeIcon
                                        icon={faPaw}
                                        style={{ color: '#078550' }}
                                    />
                                    g
                                </span>
                            </h2>
                        </Link>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column text-center">
                        <Link className="nav-link py-2 menu-link" to="/">
                            <FontAwesomeIcon icon={faHouse} style={{ color: '#000000' }} /> Головна
                        </Link>
                        <Link className="nav-link py-2 menu-link" to="/services">
                            <FontAwesomeIcon icon={faFlask} style={{ color: '#000000' }} /> Послуги
                        </Link>
                        <Link className="nav-link py-2 menu-link" to="/about">
                            <FontAwesomeIcon
                                icon={faHouseChimneyMedical}
                                style={{ color: '#000000' }}
                            />
                            Про нас
                        </Link>
                        {isLoggedIn && (
                            <Link className="nav-link py-2 menu-link" to="/find-match">
                                <FontAwesomeIcon icon={faHeart} style={{ color: '#db0a0a' }} /> LoveDogs
                            </Link>
                        )}
                        <Link className="nav-link py-2 menu-link" to="/contacts">
                            <FontAwesomeIcon icon={faHeadset} style={{ color: '#000000' }} /> Контакти
                        </Link>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Navbar>
                    {/* Логотип */}
                    <div className="logo col-auto d-flex align-items-center justify-content-center mt-1">
                        <Link className="navbar-brand text-white" to="/"><h2 className="poppins-semibold fw-medium logoOnegog mb-0">
                                One
                                <span className="fw-bolder">
                                    D<FontAwesomeIcon icon={faPaw} style={{ color: '#078550' }} />
                                    g
                                </span>
                            </h2>
                        </Link>
                    </div>

                    {/* Панель користувача */}
                    <div className="user-panel col-auto d-flex justify-content-end align-items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <button className="btn user-btn-icon  rounded-circle iconMenu" onClick={toggleSearch}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                                </button>
                                <div className="position-relative" ref={notificationsRef}>
                                    <button className="btn user-btn-icon  rounded-circle iconMenu" onClick={toggleNotifications}>
                                        <FontAwesomeIcon icon={faBell} size="lg" />
                                        {notifications.filter((n) => !n.isRead).length > 0 && (
                                            <span className="badge bg-danger position-absolute  rounded-circle top-0 start-100 translate-middle">
                                                {notifications.filter((n) => !n.isRead).length}
                                            </span>
                                        )}
                                    </button>
                                    {isNotificationsOpen && (
                                        <ul className="notifications-dropdown position-absolute">
                                            {notifications.length > 0 ? (
                                                notifications.map(({ id, message, isRead }) => (
                                                    <li
                                                        key={id}
                                                        className={`dropdown-item ${isRead ? 'text-muted' : ''}`}
                                                        onClick={() => markAsRead(id)}
                                                    >
                                                        {message}
                                                        <button
                                                            className="btn btn-sm text-danger ms-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(id);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="dropdown-item">Немає нових повідомлень</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                                <div className="nav-item dropdown user-dropdown">
                                    <button
                                        className="btn user-btn-icon dropdown  rounded-circle iconMenu"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        aria-label="Меню профіля"
                                    >
                                        <FontAwesomeIcon icon={faUser} size="lg" /></button>
                                    <ul className="dropdown-menu dropdown-menu-end user-dropdown-menu">
                                        <li> <Link className="dropdown-item user-dropdown-item" to="/profile">
                                                Профіль
                                            </Link></li>
                                        <li>
                                            <hr className="dropdown-divider user-dropdown-divider" />
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item user-dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                Вийти
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <button
                                className="btn auth-btn-login btn-outline-success btn-sm"
                                onClick={() => navigate('/login')}
                            >
                                Войти
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Поиск */}
            {isSearchOpen && (
                <div className="container search-bar mt-3">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Пошук..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="btn btn-success mt-2">
                            Пошук
                        </button>
                    </form>
                    <ul className="search-results mt-3">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <li key={index}>{result}</li>
                            ))
                        ) : (
                            searchQuery && <li>Нічого не знайдено</li>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Header;