import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const countryCodes = [
    { code: '+38', label: 'UA' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+49', label: 'DE' },
    { code: '+48', label: 'PL' }
];

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+38'); 
    const [nickname, setNickname] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const isValidPhone = (phone) => {
        const phoneRegex = /^\d{10}$/; 
        return phoneRegex.test(phone);
    };

    const isNicknameUnique = async (nickname) => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("nickname", "==", nickname));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setPhoneError('');
        setNicknameError('');
        setGeneralError('');

        if (!isValidEmail(email)) {
            setEmailError('Невірний email. Введіть коректну адресу.');
            return;
        }

        if (!isValidPassword(password)) {
            setPasswordError('Пароль повинен бути не менше 8 символів та містити літери, цифри і спецсимволи.');
            return;
        }

        if (!isValidPhone(phone)) {
            setPhoneError('Невірний номер телефону. Введіть номер з 10 цифр.');
            return;
        }

        const isUnique = await isNicknameUnique(nickname);
        if (!isUnique) {
            setNicknameError('Цей нік вже зайнятий. Виберіть інший.');
            return;
        }

        try {
            // Регистрация пользователя
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Создание профиля пользователя в Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name,
                surname,
                phone: `${countryCode}${phone}`, // Добавляем код страны к номеру телефона
                email,
                nickname,
                createdAt: new Date(),
            });

            console.log('Користувач успішно зареєстрований:', user);

            // Перенаправление на страницу профиля после успешной регистрации
            navigate('/profile');
        } catch (error) {
            setGeneralError('Помилка реєстрації. Спробуйте ще раз.');
            console.error('Помилка реєстрації:', error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <div className='d-flex'>
                    <button className='me-1' style={ButtonBack} onClick={() => navigate('/Login')}>
                        <FontAwesomeIcon icon={faChevronUp} rotation={270} />
                    </button>
                    <h2 className="ps-5 mb-4">Реєстрація</h2>
                </div>
                
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Ім'я</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Прізвище</label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Номер телефону</label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                style={{ maxWidth: '100px' }}
                            >
                                {countryCodes.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.label} ({country.code})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="form-control"
                                placeholder="XXXXXXXXXX" 
                            />
                        </div>
                        {phoneError && <p className="text-danger">{phoneError}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                            placeholder='example@gmail.com'
                        />
                        {emailError && <p className="text-danger">{emailError}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                        />
                        {passwordError && <p className="text-danger">{passwordError}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Нікнейм</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            className="form-control"
                        />
                        {nicknameError && <p className="text-danger">{nicknameError}</p>}
                    </div>
                    {generalError && <p className="text-danger">{generalError}</p>}
                    <button type="submit" className="btn btn-primary w-100">Зареєструватися</button>
                </form>
            </div>
        </div>
    );
};

const ButtonBack = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
};

export default Register;