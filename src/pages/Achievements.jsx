import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]); // Список досягнень
  const [formVisible, setFormVisible] = useState(false); // Видимість форми додавання
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    image: null
  });
  const [errorMessage, setErrorMessage] = useState(''); // Повідомлення про помилку

  const achievementsCollection = collection(db, 'achievements'); // Колекція в Firebase

  // Завантаження досягнень з Firestore
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(achievementsCollection);
        const achievementsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAchievements(achievementsList);
      } catch (error) {
        console.error('Помилка при завантаженні досягнень:', error);
      }
    };

    fetchAchievements();
  }, []);

  // Обробник зміни полів форми
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement({ ...newAchievement, [name]: value });
  };

  // Обробник завантаження зображення
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAchievement((prevAchievement) => ({ ...prevAchievement, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newAchievement.date) {
        setErrorMessage('Будь ласка, оберіть дату!');
        return;
      }

      const docRef = await addDoc(achievementsCollection, newAchievement); // Збереження у Firestore
      setAchievements([...achievements, { ...newAchievement, id: docRef.id }]); // Оновлення стану
      setFormVisible(false); // Приховуємо форму після додавання
      setNewAchievement({ title: '', description: '', date: '', image: null }); // Скидаємо поля форми
      setErrorMessage(''); // Очищуємо повідомлення про помилку
    } catch (error) {
      console.error('Помилка при збереженні досягнення:', error);
    }
  };

  // Обробник видалення досягнення
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'achievements', id)); // Видалення документа з Firestore
      setAchievements(achievements.filter((achievement) => achievement.id !== id)); // Оновлення стану
    } catch (error) {
      console.error('Помилка при видаленні досягнення:', error);
    }
  };

  const todayDate = new Date().toISOString().split('T')[0]; // Поточна дата у форматі YYYY-MM-DD

  return (
    <div className='bgPet'>
      <h2 className="text-center mt-3">Досягнення</h2>

      {/* Список досягнень */}
      <div className="d-flex flex-wrap justify-content-start mt-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="card mb-3 me-3 shadow" style={{ width: '18rem' }}>
            {achievement.image && (
              <img
                src={achievement.image}
                alt="Досягнення"
                className="card-img-top"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <h5 className="card-title text-success">{achievement.title}</h5>
              <p><strong>Опис:</strong> {achievement.description}</p>
              <p><strong>Дата:</strong> {achievement.date}</p>
              <button
                className="btn btn-danger mt-2"
                onClick={() => handleDelete(achievement.id)}
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mt-4" onClick={() => setFormVisible(!formVisible)}>
      Додати досягнення
      </button>

      {/* Форма додавання досягнення */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded shadow-sm">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <div className="mb-3">
            <label className="form-label">Назва досягнення</label>
            <input
              type="text"
              name="title"
              value={newAchievement.title}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Опис</label>
            <textarea
              name="description"
              value={newAchievement.description}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Дата</label>
            <input
              type="date"
              name="date"
              value={newAchievement.date}
              onChange={handleInputChange}
              className="form-control"
              max={todayDate} // Обмеження дати до сьогоднішнього дня
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Завантажити зображення/сертифікат</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Зберегти досягнення</button>
        </form>
      )}
    </div>
  );
};

export default Achievements;