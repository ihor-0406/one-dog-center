import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './Album.css';

const PhotoAlbum = () => {
  const [pets, setPets] = useState([]);
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ petName: '', image: null });
  const [serverPhotos, setServerPhotos] = useState({}); // Фотографії з сервера

  const API_KEY = 'live_NFZa4o8wnv9u1dpiH7CdcpHXIy5dY5HJvKR8QoJuy3CyEL2pI29ezsZ5V235NRFA';

  // Завантаження улюбленців з Firebase
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsCollection = collection(db, 'pets');
        const petsSnapshot = await getDocs(petsCollection);
        const petsList = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsList);
      } catch (error) {
        console.error('Помилка завантаження улюбленців:', error);
      }
    };

    fetchPets();
  }, []);

  // Завантаження фото з API The Dog
  useEffect(() => {
    const fetchDogImages = async () => {
      try {
        const newImages = {};

        for (const pet of pets) {
          if (pet.breed) {
            const response = await axios.get(`
              https://api.thedogapi.com/v1/images/search?limit=5&api_key=${API_KEY}&q=${encodeURIComponent(pet.breed)}
            `);
            newImages[pet.name] = response.data.map((img) => img.url);
          }
        }

        setImages(newImages);
      } catch (error) {
        console.error('Помилка завантаження фото з API The Dog:', error);
      }
    };

    if (pets.length > 0) {
      fetchDogImages();
    }
  }, [pets]);

  // Завантаження фотографій з сервера Firebase
  useEffect(() => {
    const fetchServerPhotos = async () => {
      try {
        const photosCollection = collection(db, 'photos');
        const photosSnapshot = await getDocs(photosCollection);
        const photosList = photosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const organizedPhotos = photosList.reduce((acc, photo) => {
          acc[photo.petName] = acc[photo.petName]
            ? [...acc[photo.petName], photo.image]
            : [photo.image];
          return acc;
        }, {});

        setServerPhotos(organizedPhotos);
      } catch (error) {
        console.error('Помилка завантаження фото з сервера:', error);
      }
    };

    fetchServerPhotos();
  }, []);

  // Обробник завантаження фото
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto((prevPhoto) => ({ ...prevPhoto, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Обробник додавання нового фото
  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      if (!newPhoto.petName || !newPhoto.image) {
        alert('Оберіть улюбленця та завантажте фото!');
        return;
      }

      // Додавання фото у Firebase
      const photosCollection = collection(db, 'photos');
      await addDoc(photosCollection, newPhoto);

      // Оновлення локального стану
      setServerPhotos((prevPhotos) => ({
        ...prevPhotos,
        [newPhoto.petName]: [...(prevPhotos[newPhoto.petName] || []), newPhoto.image],
      }));

      // Скидання форми
      setNewPhoto({ petName: '', image: null });
      setFormVisible(false);
    } catch (error) {
      console.error('Помилка додавання фото:', error);
    }
  };

  return (
    <div className="photo-album bgPet">
      <h2>Фотоальбом</h2>

      {/* Відображення фото по улюбленцях */}
      <div className="pets-photos">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-photos-section">
            <h3>{pet.name}</h3>
            <div className="photo-grid">
              {/* Фото з сервера */}
              {serverPhotos[pet.name]?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${pet.name} фото з сервера`}
                  className="photo-thumbnail"
                  onClick={() => setSelectedImage(url)}
                />
              ))}
              {/* Фото з API */}
              {images[pet.name]?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${pet.name} фото з API`}
                  className="photo-thumbnail"
                  onClick={() => setSelectedImage(url)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Додавання нового фото */}
      <button className="btn btn-primary" onClick={() => setFormVisible(!formVisible)}>
        Додати нове фото
      </button>

      {formVisible && (
        <form onSubmit={handleAddPhoto} className="add-photo-form">
          <div className="mb-3">
            <label className="form-label">Оберіть улюбленця</label>
            <select
              className="form-control"
              value={newPhoto.petName}
              onChange={(e) => setNewPhoto((prevPhoto) => ({ ...prevPhoto, petName: e.target.value }))}
            >
              <option value="">Оберіть улюбленця</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.name}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Завантажте фото</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
          </div>
          <button type="submit" className="btn btn-success">
            Зберегти фото
          </button>
        </form>
      )}

      {/* Відображення вибраного фото */}
      {selectedImage && (
        <div className="photo-viewer">
          <div className="photo-viewer-overlay" onClick={() => setSelectedImage(null)}></div>
          <div className="photo-viewer-content">
            <img src={selectedImage} alt="Перегляд фото" className="photo-viewer-image" />
            <button className="photo-viewer-close" onClick={() => setSelectedImage(null)}>
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAlbum;