import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // Состояние для чекбокса "Запомнить меня"
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Проверка токена при загрузке компонента
        const token = localStorage.getItem('userToken');
        if (token) {
            navigate('/'); // Перенаправление на главную страницу, если токен уже существует
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Установка персистентности сессии в зависимости от состояния чекбокса
            const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistenceType);

            // Вход пользователя
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Пользователь вошел в систему:', user);

            if (rememberMe) {
                const token = await user.getIdToken();
                localStorage.setItem('userToken', token); // Сохраняем токен в localStorage
            }

            navigate('/'); // Перенаправление на главную страницу после успешного входа
        } catch (error) {
            setError('Помилка входу. Перевірте введені дані.');
            console.error('Помилка входу:', error);
        }
    };

    const handleLogout = async () => {
        try {
            // Выходим из Firebase Auth и очищаем сессию
            await signOut(auth);
            localStorage.removeItem('userToken'); // Удаляем токен из localStorage
            navigate('/login'); // Перенаправление на страницу входа
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Вхід</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                        />
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
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="form-check-input"
                            id="rememberMe"
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                            Запомнить меня
                        </label>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary w-100 me-2">Войти</button>
                        <button type="button" onClick={() => navigate('/register')} className="btn btn-secondary w-100">
                            Зареєструватися
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;