import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/profile.css';

const Profile = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [about, setAbout] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfileData(user);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchProfileData = async (user) => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAvatar(localStorage.getItem('avatar') || null);
        setName(data.name || '');
        setSurname(data.surname || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setNickname(data.nickname || '');
        setAbout(data.about || '');
        setBirthDate(data.birthDate || '');
        if (data.birthDate) {
          calculateAge(data.birthDate);
        }
      } else {
        console.log('Документ профиля не найден!');
      }
    } catch (error) {
      console.error('Ошибка при получении данных профиля:', error);
    }
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const calculatedAge = now.getFullYear() - birth.getFullYear();
    setAge(calculatedAge);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userDoc, {
        name,
        surname,
        phone,
        email,
        nickname,
        about,
        birthDate,
      });
      setIsEditing(false);
      console.log('Профіль оновлено успішно');
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        localStorage.setItem('avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(confirmEmail, confirmPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await deleteDoc(doc(db, 'users', user.uid));
        await user.delete();
        console.log('Аккаунт успешно удален');
        navigate('/signup');
      } catch (error) {
        console.error('Ошибка при удалении аккаунта:', error);
        setError('Неправильный email или пароль');
      }
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setError('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmEmail('');
    setConfirmPassword('');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
      </div>
    );
  }

  const isMainProfile = location.pathname === '/profile';

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-end text-center me-4">
          <button onClick={openDeleteModal} className="btn border border-black border border-bottom-0 btn-outline-danger rounded-3 rounded-bottom-0">
            &#10005;
          </button>
        </div>
      <div className="card shadow p-4">
        <h1 className="text-center mb-4">Профіль</h1>
        <div className="row">
          <div className="col-12 col-md-4 text-center mb-4">
            <label htmlFor="avatarInput" className="d-flex justify-content-center align-items-center" style={{ cursor: 'pointer' }}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="rounded-circle mb-3 border border-3 border-black" style={{ width: '18rem', height: '18rem', objectFit: 'cover' }} />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} size="8x" className="text-secondary" />
              )}
            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              className="d-none"
            />
          </div>

          <div className="col-12 col-md-8">
            <h4 className="text-primary">Інформація про себе</h4>
            {isEditing ? (
              <>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я" className="form-control mb-2" />
                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Прізвище" className="form-control mb-2" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" className="form-control mb-2" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="form-control mb-2" />
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Нікнейм" className="form-control mb-2" />
                <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Про себе" className="form-control mb-2" />
                <label className="form-label">Дата народження:</label>
                <input type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); calculateAge(e.target.value); }} className="form-control mb-2" />
              </>
            ) : (
              <div className="mt-2">
                <p><strong>Ім'я:</strong> {name}</p>
                <p><strong>Прізвище:</strong> {surname}</p>
                <p><strong>Телефон:</strong> {phone}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Нікнейм:</strong> {nickname}</p>
                <p><strong>Про себе:</strong> {about || 'Немає інформації'}</p>
                <p><strong>Вік:</strong> {age} років</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-end mt-4">
          <button onClick={handleEditToggle} className="btn btn-outline-success me-2">
            {isEditing ? 'Скасувати' : 'Редагувати'}
          </button>
          {isEditing && (
            <button onClick={handleSave} className="btn btn-success">
              Зберегти
            </button>
          )}
        </div>
        <hr />

        <ul className="nav nav-tabs">
          <li className="nav-item ">
            <Link className="nav-link text-success" to="pet">Питомец</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-success" to="history">Історія лікування</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-success" to="achievements">Досягнення</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-success" to="album">Фотоальбом</Link>
          </li>
        </ul>

        <div className="tab-content mt-3">
          {isMainProfile ? (
            <div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal show d-block" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Підтвердіть видалення аккаунта</h5>
                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>Будь ласка, введіть свій email і пароль для підтвердження:</p>
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  className="form-control mb-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className="text-danger">{error}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;