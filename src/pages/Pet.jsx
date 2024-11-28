import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import "./Pet.css"

const Pet = () => {
  const [breeds, setBreeds] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [pets, setPets] = useState([]); // Массив для хранения питомцев из базы данных
  const [newPet, setNewPet] = useState({
    name: '',
    birthYear: '',
    breed: '',
    color: '',
    gender: 'Самець',
    hadLitter: false,
    height: '',
    weight: '',
    specialFeatures: '',
    image: null
  });

  const colors = ['Білий', 'Чорний', 'Коричневий', 'Сірий', 'Рудий', 'Плямистий', 'Триколірний'];

  // Загрузка данных пород собак из API и питомцев из Firebase
  useEffect(() => {
    fetch('https://api.thedogapi.com/v1/breeds')
      .then(response => response.json())
      .then(data => {
        setBreeds(data);
      })
      .catch(error => console.error('Помилка при завантаженні даних про породи:', error));

    const fetchPets = async () => {
      const querySnapshot = await getDocs(collection(db, 'pets'));
      const petsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPets(petsData);
    };

    fetchPets();
  }, []);

  // Функция для добавления уведомлений
  const addNotification = async (message) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        message,
        isRead: false,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Ошибка при добавлении уведомления:', error);
    }
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPet({ ...newPet, [name]: type === 'checkbox' ? checked : value });
  };

  // Обработчик загрузки изображения
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPet((prevPet) => ({ ...prevPet, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Добавляем питомца в Firestore
      const docRef = await addDoc(collection(db, 'pets'), newPet);
      setPets([...pets, { ...newPet, id: docRef.id }]); // Добавляем нового питомца в состояние
      setFormVisible(false); // Скрыть форму после создания питомца
      setNewPet({
        name: '',
        birthYear: '',
        breed: '',
        color: '',
        gender: 'Самець',
        hadLitter: false,
        height: '',
        weight: '',
        specialFeatures: '',
        image: null
      });

      // Добавляем уведомление о новом питомце
      await addNotification(`Новий питомец "${newPet.name}" був успішно доданий`);
    } catch (error) {
      console.error('Ошибка при добавлении питомца:', error);
    }
  };

  // Обработчик удаления питомца
  const handleDeletePet = async (petId) => {
    try {
      await deleteDoc(doc(db, 'pets', petId)); // Удаляем питомца из Firestore
      setPets(pets.filter(pet => pet.id !== petId)); // Обновляем состояние, удаляя питомца из списка
    } catch (error) {
      console.error('Ошибка при удалении питомца:', error);
    }
  };

  return (
    <div className='bgPet'>
      <h2>Питомці</h2> {/* Карточки с информацией о питомцах */}
      <div className="d-flex flex-wrap ms-3">
        {pets.map((pet) => (
          <div key={pet.id} className="card mb-3 me-3" style={{ width: '18rem' }}>
            <div className='d-flex justify-content-end me-2 my-2'>
              <button onClick={() => handleDeletePet(pet.id)} className="btn btn-outline-danger rounded-circle">
                &#10005;
              </button>
            </div>
            {pet.image && <img src={pet.image} alt="Pet" className="card-img-top" style={{ width: '100%',  height: '80%', objectFit: 'cover' }} />}
            <div className="card-body">
              <h5 className="card-title">{pet.name}</h5>
              <p><strong>Рік народження:</strong> {pet.birthYear}</p>
              <p><strong>Порода:</strong> {pet.breed}</p>
              <p><strong>Колір:</strong> {pet.color}</p>
              <p><strong>Стать:</strong> {pet.gender}</p>
              {pet.gender === 'Самка' && (
                <p><strong>Був виводок:</strong> {pet.hadLitter ? 'Так' : 'Ні'}</p>
              )}
              <p><strong>Зріст:</strong> {pet.height} см</p>
              <p><strong>Вага:</strong> {pet.weight} кг</p>
              <p><strong>Особливі прикмети:</strong> {pet.specialFeatures || 'Немає'}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary m-3" onClick={() => setFormVisible(!formVisible)}>
        Створити нового питомця
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Ім'я</label>
            <input
              type="text"
              name="name"
              value={newPet.name}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Рік народження</label>
            <input
              type="number"
              name="birthYear"
              value={newPet.birthYear}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Порода</label>
            <select
              name="breed"
              value={newPet.breed}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Оберіть породу</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.name}>
                  {breed.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Колір</label>
            <select
              name="color"
              value={newPet.color}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Оберіть колір</option>
              {colors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Стать</label>
            <select
              name="gender"
              value={newPet.gender}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="Самець">Самець</option>
              <option value="Самка">Самка</option>
            </select>
          </div>
          {newPet.gender === 'Самка' && (
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="hadLitter"
                checked={newPet.hadLitter}
                onChange={handleInputChange}
                className="form-check-input"
              /> <label className="form-check-label">Був виводок</label>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Зріст (см)</label>
            <input
              type="number"
              name="height"
              value={newPet.height}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Вага (кг)</label>
            <input
              type="number"
              name="weight"
              value={newPet.weight}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Особливі прикмети</label>
            <textarea
              name="specialFeatures"
              value={newPet.specialFeatures}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Зображення</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success ">
            Зберегти питомця
          </button>
        </form>
      )}
    </div>
  );
};

export default Pet;