import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import './Pet.css';

const Pet = () => {
  const [breeds, setBreeds] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [pets, setPets] = useState([]);
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
    image: null,
  });

  const colors = ['Білий', 'Чорний', 'Коричневий', 'Сірий', 'Рудий', 'Плямистий', 'Триколірний'];

  // Завантажуємо данні пород собак і улюбленців користовача 
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds');
        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error('Помилка при завантаженні даних про породи:', error);
      }
    };

    const fetchPets = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const petsQuery = query(collection(db, 'pets'), where('userId', '==', user.uid));
        const petsSnapshot = await getDocs(petsQuery);
        const petsList = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsList);
      } catch (error) {
        console.error('Помилка при завантаженні улюбленців:', error);
      }
    };

    fetchBreeds();
    fetchPets();
  }, []);

  // Обробник зміни полів форми
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPet({ ...newPet, [name]: type === 'checkbox' ? checked : value });
  };

  // Обробник завантаження зображення
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPet((prevPet) => ({ ...prevPet, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert('Будь ласка, увійдіть у систему, щоб додати улюбленця.');
      return;
    }

    if (!newPet.name , !newPet.breed,  !newPet.birthYear) {
      alert('Будь ласка, заповніть усі обов’язкові поля.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'pets'), {
        ...newPet,
        userId: user.uid,
      });
      setPets([...pets, { ...newPet, id: docRef.id }]);
      setFormVisible(false);
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
        image: null,
      });
    } catch (error) {
      console.error('Помилка при додаванні улюбленця:', error);
    }
  };

  // Обробник відалення улюбленця
  const handleDeletePet = async (petId) => {
    try {
      await deleteDoc(doc(db, 'pets', petId));
      setPets(pets.filter((pet) => pet.id !== petId));
    } catch (error) {
      console.error('Помилка при видаленні улюбленця:', error);
    }
  };

  return (
    <div className='bgPet'>
      <h2>Питомці</h2> 
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