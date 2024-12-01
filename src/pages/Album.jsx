import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db, auth } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, query, where, deleteDoc } from 'firebase/firestore';
import './Album.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const PhotoAlbum = () => {
  const [pets, setPets] = useState([]);
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePetName, setSelectedImagePetName] = useState(null); 
  const [formVisible, setFormVisible] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ petName: '', image: null });
  const [serverPhotos, setServerPhotos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = 'live_NFZa4o8wnv9u1dpiH7CdcpHXIy5dY5HJvKR8QoJuy3CyEL2pI29ezsZ5V235NRFA';

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchPets = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const petsCollection = collection(db, 'pets');
        const petsQuery = query(petsCollection, where('userId', '==', userId));
        const petsSnapshot = await getDocs(petsQuery);
        const petsList = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsList);
      } catch (error) {
        console.error('Помилка завантаження улюбленців:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPets();
  }, [userId]);

  useEffect(() => {
    const fetchServerPhotos = async () => {
      if (!userId) return;
      try {
        const photosCollection = collection(db, 'photos');
        const photosQuery = query(photosCollection, where('userId', '==', userId));
        const photosSnapshot = await getDocs(photosQuery);
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
  }, [userId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto((prevPhoto) => ({ ...prevPhoto, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      if (!newPhoto.petName || !newPhoto.image) {
        alert('Оберіть улюбленця та завантажте фото!');
        return;
      }

      const photosCollection = collection(db, 'photos');
      await addDoc(photosCollection, { ...newPhoto, userId });

      setServerPhotos((prevPhotos) => ({
        ...prevPhotos,
        [newPhoto.petName]: [...(prevPhotos[newPhoto.petName] || []), newPhoto.image],
      }));

      setNewPhoto({ petName: '', image: null });
      setFormVisible(false);
    } catch (error) {
      console.error('Помилка додавання фото:', error);
    }
  };

  const handleDeletePhoto = async (petName, imageUrl) => {
    console.log("Видаляємо фото для улюбленця:", petName, "URL:", imageUrl);
    try {
      const photosCollection = collection(db, 'photos');
      const photosQuery = query(
        photosCollection,
        where('userId', '==', userId),
        where('petName', '==', petName),
        where('image', '==', imageUrl)
      );
      const photosSnapshot = await getDocs(photosQuery);
  
      if (photosSnapshot.empty) {
        console.error("Документів для видалення не знайдено!");
        return;
      }
  
      photosSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log("Документ видалено:", doc.ref.id);
      });
  
      setServerPhotos((prevPhotos) => {
        const updatedPhotos = { ...prevPhotos };
        updatedPhotos[petName] = updatedPhotos[petName].filter((url) => url !== imageUrl);
        return updatedPhotos;
      });
  
      setSelectedImage(null);
      setSelectedImagePetName(null);
      console.log('Фото успішно видалено');
    } catch (error) {
      console.error('Помилка видалення фото:', error);
    }
  };

  return (
    <div className="photo-album bgPet">
      <h2 className="album-title">Фотоальбом</h2>

      {isLoading ? (
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          <p>Завантаження...</p>
        </div>
      ) : (
        <div className="pets-photos">
          {pets.map((pet) => (
            <div key={pet.id} className="pet-photos-section">
              <h3>{pet.name}</h3>
              <div className="photo-grid">
                {serverPhotos[pet.name]?.map((url, index) => (
                  <div key={index} className="photo-thumbnail-wrapper">
                    <img
                      src={url}
                      alt={`Фото ${pet.name}`}
                      className="photo-thumbnail"
                      onClick={() => {
                        setSelectedImage(url);
                        setSelectedImagePetName(pet.name);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-primary add-photo-button" onClick={() => setFormVisible(!formVisible)}>
        <FontAwesomeIcon icon={faPlus} /> Додати нове фото
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
            <FontAwesomeIcon icon={faSave} /> Зберегти фото
          </button>
        </form>
      )}

      {selectedImage && (
        <div className="photo-viewer">
          <div className="photo-viewer-overlay" onClick={() => setSelectedImage(null)}></div>
          <div className="photo-viewer-content">
            <img src={selectedImage} alt="Перегляд фото" className="photo-viewer-image" />
            <div className="photo-viewer-controls">
              <button
                className="btn btn-danger delete-photo-button"
                onClick={() => handleDeletePhoto(selectedImagePetName, selectedImage)}
              >
                <FontAwesomeIcon icon={faTrash} /> 
              </button>
              <button className="btn btn-secondary close-photo-button" onClick={() => setSelectedImage(null)}>
                <FontAwesomeIcon icon={faTimes} /> 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAlbum;