import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './FindMatch.css';

const getRandomColor = () => {
  const colors = ['чорний', 'білий', 'рудий', 'коричневий', 'сірий', 'підпалий'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomAge = () => Math.floor(Math.random() * 8) + 1;

const getRandomGender = () => (Math.random() > 0.5 ? 'male' : 'female');

const FindMatch = () => {
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [userName, setUserName] = useState(''); // Ім'я користувача

  const userId = auth.currentUser?.uid;

  // Завантаження імені користувача
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;
    
      try {
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('uid', '==', userId)); 
        const userSnapshot = await getDocs(userQuery);
    
        if (userSnapshot.empty) {
          console.error('Дані користувача не знайдено в Firebase!');
          setUserName('Користувач');
          return;
        }
    
        const userData = userSnapshot.docs[0].data();
        console.log('Завантажено дані користувача:', userData);
        setUserName(userData?.name || 'Користувач'); 
      } catch (error) {
        console.error('Помилка при завантаженні імені користувача:', error);
      }
    };

    fetchUserName();
  }, [userId]);

  // Завантаження улюбленців
  useEffect(() => {
    const fetchUserPets = async () => {
      if (!userId) return;

      try {
        const petsCollection = collection(db, 'pets');
        const petsQuery = query(petsCollection, where('userId', '==', userId));
        const petsSnapshot = await getDocs(petsQuery);
        const petsList = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPets(petsList);
      } catch (error) {
        console.error('Помилка при завантаженні улюбленців з Firebase:', error);
      }
    };

    fetchUserPets();
  }, [userId]);

  const generateMatches = async () => {
    if (!selectedPet) return;

    setIsLoading(true);

    try {
      const dogResponse = await axios.get('https://api.thedogapi.com/v1/breeds');
      const dogImages = dogResponse.data;

      const userResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
      const users = userResponse.data;

      const matches = Array.from({ length: 10 }).map((_, index) => {
        const imageDog = dogImages.find((dog) => dog.name === selectedPet.breed);
        const user = users[index % users.length];
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: `${selectedPet.breed} ${Math.floor(Math.random() * 100)}`,
          breed: selectedPet.breed,
          gender: getRandomGender(),
          age: getRandomAge(),
          color: getRandomColor(),
          owner: {
            nickname: user.username,
            email: user.email,
          },
          image: imageDog
            ? `https://cdn2.thedogapi.com/images/${imageDog.reference_image_id}.jpg`
            : 'https://via.placeholder.com/150',
        };
      });

      setPotentialMatches(matches);
      setCurrentMatchIndex(0);
    } catch (error) {
      console.error('Помилка при генерації пар:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPet = (petId) => {
    const pet = userPets.find((p) => p.id === petId);
    setSelectedPet(pet);
    setPotentialMatches([]);
  };

  const handleNextMatch = () => {
    if (currentMatchIndex < potentialMatches.length - 1) {
      setIsCardLoading(true);
      setTimeout(() => {
        setCurrentMatchIndex(currentMatchIndex + 1);
        setIsCardLoading(false);
      }, 500);
    }
  };

  const handlePrevMatch = () => {
    if (currentMatchIndex > 0) {
      setIsCardLoading(true);
      setTimeout(() => {
        setCurrentMatchIndex(currentMatchIndex - 1);
        setIsCardLoading(false);
      }, 500);
    }
  };

  const handleContactOwner = () => {
    const match = potentialMatches[currentMatchIndex];
    const subject = "Запит на договір про в'язку з вашим улюбленцем";
    const body = `
Доброго дня!

Мене звати ${userName}. Я зацікавлений у можливості в'язки з вашим улюбленцем, ${match.name}.
Ваш улюбленець:
- Порода: ${match.breed}
- Вік: ${match.age} років
- Окрас: ${match.color}

Мій улюбленець:
- Ім'я: ${selectedPet.name}
- Порода: ${selectedPet.breed}
- Вік: ${selectedPet.age || 'невідомо'} років

Будь ласка, зв'яжіться зі мною для обговорення деталей.

З найкращими побажаннями,
${userName}
`;
    window.location.href = `mailto:${match.owner.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="container mt-4 ">
      <h2 className="text-center mb-4">Знайти пару для вашого улюбленця</h2>

      <div className="mb-4">
        <h4>Ваші улюбленці:</h4>
        <select className="form-control" onChange={(e) => handleSelectPet(e.target.value)}>
          <option value="">Оберіть улюбленця</option>
          {userPets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name} ({pet.breed})
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary mt-3"
          onClick={generateMatches}
          disabled={!selectedPet || isLoading}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Знайти пару'
          )}
        </button>
      </div>

      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      )}

      {!isLoading && selectedPet && potentialMatches.length > 0 && (
        <div className="d-flex align-items-center justify-content-center findMatch">
          <button
            className="btn btn-success rounded-circle me-3"
            onClick={handlePrevMatch}
            disabled={currentMatchIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="match-card">
            {isCardLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="card mx-auto shadow-sm" style={{ maxWidth: '300px' }}>
                  <img
                    src={potentialMatches[currentMatchIndex]?.image}
                    className="card-img"
                    alt={potentialMatches[currentMatchIndex]?.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      {potentialMatches[currentMatchIndex]?.name}
                    </h5>
                    <p className="card-text">
                      <strong>Порода:</strong> {potentialMatches[currentMatchIndex]?.breed}
                    </p>
                    <p className="card-text">
                      <strong>Стать:</strong>{' '}
                      {potentialMatches[currentMatchIndex]?.gender === 'male'
                        ? 'Самець'
                        : 'Самка'}
                    </p>
                    <p className="card-text">
                      <strong>Вік:</strong> {potentialMatches[currentMatchIndex]?.age} років
                    </p>
                    <p className="card-text">
                      <strong>Окрас:</strong> {potentialMatches[currentMatchIndex]?.color}
                    </p>
                    <p className="card-text">
                      <strong>Власник:</strong> {potentialMatches[currentMatchIndex]?.owner.nickname}
                    </p>
                    <p className="card-text">
                      <strong>Email:</strong> {potentialMatches[currentMatchIndex]?.owner.email}
                    </p>
                    <button
                      className="btn btn-outline-success mt-2"
                      onClick={handleContactOwner}
                    >
                      Написати власнику
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <button className="btn btn-success rounded-circle ms-3"
            onClick={handleNextMatch}
            disabled={currentMatchIndex === potentialMatches.length - 1}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}

      {!isLoading && selectedPet && potentialMatches.length === 0 && (
        <p className="text-center text-danger mt-4">Немає підходящих пар для вашого улюбленця.</p>
      )}
    </div>
  );
};

export default FindMatch;