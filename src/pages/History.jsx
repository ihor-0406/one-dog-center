import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';
import { db, auth } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import vetsData from '../data/vets.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './History.css';

registerLocale('uk', uk);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const specialistTypeTranslations = {
  vet: 'Ветеринар',
  kynologist: 'Кінолог',
  grooming: 'Грумінг',
};

const History = () => {
  const [specialistType, setSpecialistType] = useState('vet');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedPetForChart, setSelectedPetForChart] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [newGrowthRecord, setNewGrowthRecord] = useState({ date: new Date(), weight: '', height: '' });

  const allSpecialists = [
    ...vetsData.vets.map((vet) => ({ ...vet, type: 'vet' })),
    ...vetsData.kynologists.map((kynologist) => ({ ...kynologist, type: 'kynologist' })),
    ...vetsData.groomingSpecialists.map((groomer) => ({ ...groomer, type: 'grooming' })),
  ];

  // Завантаження улюбленців
  useEffect(() => {
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

    fetchPets();
  }, []);

  // Завантаження записів
  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const appointmentsQuery = query(collection(db, 'appointments'), where('userId', '==', user.uid));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsList);
      } catch (error) {
        console.error('Помилка при завантаженні записів:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Завантадення данних ваги та зросту
  useEffect(() => {
    const fetchGrowthData = async () => {
      if (selectedPetForChart) {
        try {
          const growthQuery = query(collection(db, 'growthData'), where('pet', '==', selectedPetForChart));
          const growthSnapshot = await getDocs(growthQuery);
          const growthList = growthSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setGrowthData(growthList);
        } catch (error) {
          console.error('Помилка при завантаженні даних зросту:', error);
        }
      }
    };

    fetchGrowthData();
  }, [selectedPetForChart]);

  // Фільтр дати та часу
  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (date < today || !selectedSpecialist) return false;

    const specialist = allSpecialists.find((spec) => spec.id === selectedSpecialist);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const workingHours = specialist?.workingHours?.[dayName];
    if (!workingHours) return false;

    const isDateBooked = appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.dateTime);

      return (
        appointmentDate.toLocaleDateString('en-US') === date.toLocaleDateString('en-US') &&
        appointmentDate.getHours() === date.getHours() &&
        appointmentDate.getMinutes() === date.getMinutes()
      );
    });

    if (isDateBooked) {
      return false;
    }

    return true; 
  };

  const filterTime = (time) => {
    if (!selectedSpecialist || !appointmentDate) return false;

    const specialist = allSpecialists.find((spec) => spec.id === selectedSpecialist);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHours = specialist?.workingHours?.[dayName];

    if (!workingHours) return false;

    const [start, end] = workingHours.split('-').map((t) => {
      const [hours, minutes] = t.trim().split(':').map(Number);
      const date = new Date(appointmentDate);
      date.setHours(hours, minutes, 0, 0);
      return date;
    });

    const isTimeBooked = appointments.some((appointment) => {
      const appointmentTime = new Date(appointment.dateTime);
      return (
        appointmentTime.toLocaleDateString('en-US') === appointmentDate.toLocaleDateString('en-US') &&
        appointmentTime.getHours() === time.getHours() &&
        appointmentTime.getMinutes() === time.getMinutes()
      );
    });

    if (isTimeBooked) return false;

    return time >= start && time <= end;
  };

  // Додавання записів
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPet , !appointmentDate , !selectedSpecialist) {
      alert('Будь ласка, виберіть тварину, дату та спеціаліста.');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const appointmentDateISOString = appointmentDate.toISOString();
    const existingAppointments = appointments.filter(
      (app) => app.pet === selectedPet && app.dateTime === appointmentDateISOString
    );

    if (existingAppointments.length > 0) {
      return;
    }

    const newAppointment = {
      pet: selectedPet,
      dateTime: appointmentDate.toISOString(),
      specialist: selectedSpecialist,
      specialistType: specialistType,
      userId: user.uid,
    };
    
    try {
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      setAppointments([...appointments, { id: docRef.id, ...newAppointment }]);
    } catch (error) {
      console.error('Помилка при додаванні запису:', error);
    }
    await addDoc(collection(db, 'notifications'), {
      message: `Запис успішно створено для Вашого улюбленця `,
      isRead: false,
      timestamp: new Date(),
    });
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      setAppointments(appointments.filter((appointment) => appointment.id !== appointmentId));
    } catch (error) {
      console.error('Помилка при видаленні запису:', error);
    }
  };
  // Данні графика зросту та ваги
const growthChartData = {
  labels: growthData.map((data) => new Date(data.date).toLocaleDateString('uk-UA')),
  datasets: [
    {
      label: 'Вага (кг)',
      data: growthData.map((data) => data.weight),
      borderColor: 'blue',
      backgroundColor: 'blue',
    },
    {
      label: 'Зріст (см)',
      data: growthData.map((data) => data.height),
      borderColor: 'green',
      backgroundColor: 'green',
    },
  ],
};

// дадавання запису зросту
const handleAddGrowthRecord = async () => {
  try {
    const newRecord = { ...newGrowthRecord, pet: selectedPetForChart };
    const docRef = await addDoc(collection(db, 'growthData'), newRecord);
    setGrowthData([...growthData, { id: docRef.id, ...newRecord }]);
    setNewGrowthRecord({ date: new Date(), weight: '', height: '' });
  } catch (error) {
    console.error('Помилка при додаванні даних зросту:', error);
  }
};

  return (
    <div className="container history-container bgPet">
      <h2>Запис до спеціаліста</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Оберіть тип спеціаліста</label>
          <select
            value={specialistType}
            onChange={(e) => setSpecialistType(e.target.value)}
            className="form-control"
            required
          >
            <option value="vet">Ветеринар</option>
            <option value="kynologist">Кінолог</option>
            <option value="grooming">Грумінг</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Оберіть спеціаліста</label>
          <select
            value={selectedSpecialist}
            onChange={(e) => setSelectedSpecialist(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Оберіть спеціаліста</option>
            {allSpecialists
              .filter((spec) => spec.type === specialistType)
              .map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name} - {spec.specialization}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Оберіть дату та час</label>
          <DatePicker
            selected={appointmentDate}
            onChange={(date) => setAppointmentDate(date)}
            className="form-control"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={30}
            filterDate={filterDate}
            filterTime={filterTime}
            locale="uk"
            placeholderText="Оберіть дату"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Оберіть улюбленця</label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Оберіть улюбленця</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-outline-success">
          Створити запис
        </button>
      </form>

      <h3 className="mt-4">Історія записів</h3>
      <table className="table table-success table-striped mt-2">
        <thead>
          <tr>
            <th>Дата та час</th>
            <th>Тип спеціаліста</th>
            <th>Спеціаліст</th>
            <th>Улюбленець</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => {
            const specialist = allSpecialists.find((spec) => spec.id === app.specialist);
            return (
              <tr key={app.id} className={`table-${specialist ? specialist.type : 'default'}`}>
                <td>{new Date(app.dateTime).toLocaleString('uk-UA')}</td>
                <td>{specialistTypeTranslations[app.specialistType]}</td>
                <td>{specialist ? specialist.name : 'Не знайдено'}</td>
                <td>{pets.find(pet => pet.id === app.pet)?.name}</td>
                <td>
                  <button
                    onClick={() => handleDeleteAppointment(app.id)}
                    className="btn"
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ color: '#f40b0b' }} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="mt-4">Графік ваги та зросту</h3>
      <div className="mt-3">
        <select
          className="form-select mb-3"
          value={selectedPetForChart}
          onChange={(e) => setSelectedPetForChart(e.target.value)}
        >
          <option value="">Оберіть улюбленця для графіка</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
        <Line data={growthChartData} />
      </div>
    </div>
  );
};

export default History;