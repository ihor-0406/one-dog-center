import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import vetsData from '../data/vets.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './History.css';

registerLocale('uk', uk);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Объект перевода типов специалистов
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

  // Загружаем питомцев
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
        console.error('Помилка при завантаженні улюбленців:', error);
      }
    };

    fetchPets();
  }, []);

  // Загружаем записи
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, 'appointments');
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
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

  // Загружаем данные роста и веса
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

  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today || !selectedSpecialist) return false;

    const specialist = allSpecialists.find((spec) => spec.id === selectedSpecialist);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return specialist?.workingHours?.[dayName] ? true : false;
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

    return time >= start && time <= end;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSpecialist , !selectedPet , !appointmentDate) {
      alert('Оберіть спеціаліста, улюбленця та дату.');
      return;
    }

    const newAppointment = {
      pet: selectedPet,
      specialist: selectedSpecialist,
      type: specialistType,
      dateTime: appointmentDate.toISOString(),
    };

    try {
      // Добавляем запись о приёме
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      setAppointments([...appointments, { id: docRef.id, ...newAppointment }]);

      // Добавляем уведомление в коллекцию "notifications"
      await addDoc(collection(db, 'notifications'), {
        message: `Запис успішно створено для улюбленця ${selectedPet}`,
        isRead: false,
        timestamp: new Date(),
      });

      // Сбрасываем значения
      setAppointmentDate(null);
      setSelectedSpecialist('');
      setSelectedPet('');
    } catch (error) {
      console.error('Помилка при створенні запису:', error);
    }
  };

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
        <div className="mb-3"><label className="form-label">Оберіть улюбленця</label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Оберіть улюбленця</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.name}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-outline-success">Створити запис</button>
      </form>

      <h3 className="mt-4">Історія записів</h3>
      <table className="table table-bordered mt-2">
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
          {appointments.map((app) => (
            <tr
              key={app.id}
              className={`table-${
                app.type === 'vet'
                  ? 'success'
                  : app.type === 'kynologist'
                  ? 'warning'
                  : 'info'
              }`}
            >
              <td>{new Date(app.dateTime).toLocaleString('uk-UA')}</td>
              <td>{specialistTypeTranslations[app.type]}</td>
              <td>
                {allSpecialists.find((spec) => spec.id === app.specialist)?.name ||
                  'Не знайдено'}
              </td>
              <td>{app.pet}</td>
              <td>
                <button
                  onClick={() =>
                    deleteDoc(doc(db, 'appointments', app.id)).then(() =>
                      setAppointments(
                        appointments.filter((a) => a.id !== app.id)
                      )
                    )
                  }
                  className="btn"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: '#f40b0b' }}
                  />
                </button>
              </td>
            </tr>
          ))}
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
            <option key={pet.id} value={pet.name}>
              {pet.name}
            </option>
          ))}
        </select>
        <Line data={growthChartData} />
      </div>
      <div className="mt-3">
        <h4>Додати дані росту та ваги</h4>
        <DatePicker
          selected={newGrowthRecord.date}
          onChange={(date) => setNewGrowthRecord({ ...newGrowthRecord, date })}
          className="form-control mb-2"
          dateFormat="dd/MM/yyyy"
          locale="uk"
        />
        <input
          type="number"
          placeholder="Вага (кг)"
          value={newGrowthRecord.weight}
          onChange={(e) =>
            setNewGrowthRecord({ ...newGrowthRecord, weight: e.target.value })
          }
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Зріст (см)"
          value={newGrowthRecord.height}
          onChange={(e) =>
            setNewGrowthRecord({ ...newGrowthRecord, height: e.target.value })
          }
          className="form-control mb-2"
        />
        <button
          onClick={handleAddGrowthRecord}
          className="btn btn-outline-success"
        >
          Додати дані
        </button>
      </div>
    </div>
  );
};

export default History;