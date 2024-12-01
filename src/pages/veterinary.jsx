import React, {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 
import "./veterinary.css"; 
import vet1 from "/image/veterinary1.jpeg";
import vet2 from "/image/veterina2.jpeg";
import vet3 from "/image/veterinary3.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import vets from "../data/vets.json";
import { FaStethoscope, FaVial, FaSyringe, FaUserMd, FaTooth } from "react-icons/fa"; 

const servicesList = [
  {
    id: 1,
    title: "Загальний огляд",
    description: "Консультація ветеринара та діагностика загального стану.",
    icon: <FaStethoscope />,
    fullList: [
      "Огляд тварини",
      "Консультація з лікування",
      "Призначення додаткових обстежень"
    ]
  },
  {
    id: 2,
    title: "Діагностика",
    description: "УЗД, аналізи крові, сечі, калу, рентгенографія.",
    icon: <FaVial />,
    fullList: [
      "Ультразвукове дослідження (УЗД)",
      "Загальний аналіз крові",
      "Біохімічний аналіз крові",
      "Рентгенологічне дослідження"
    ]
  },
  {
    id: 3,
    title: "Вакцинація",
    description: "Проведення первинної та повторної вакцинації.",
    icon: <FaSyringe />,
    fullList: [
      "Вакцинація проти сказу",
      "Вакцинація проти інфекційних хвороб",
      "Складання індивідуального графіка вакцинації"
    ]
  },
  {
    id: 4,
    title: "Хірургія",
    description: "Планові та екстрені операції.",
    icon: <FaUserMd />,
    fullList: [
      "Стерилізація та кастрація",
      "Лікування травм",
      "Видалення новоутворень"
    ]
  },
  {
    id: 5,
    title: "Стоматологія",
    description: "Чистка зубів, видалення зубного каменю, лікування.",
    icon: <FaTooth />,
    fullList: [
      "Чистка зубів від зубного каменю",
      "Лікування карієсу",
      "Видалення хворих зубів"
    ]
  },
  {
    id: 6,
    title: "Терапевтичні послуги",
    description: "Лікування внутрішніх органів та систем.",
    icon: <FaStethoscope />,
    fullList: [
      "Лікування захворювань шлунково-кишкового тракту",
      "Терапія захворювань дихальної системи",
      "Контроль та лікування хронічних захворювань"
    ]
  }
];
const priceList = [
  { service: "Загальний огляд", description: "Огляд та консультація ветеринара", price: "500 грн" },
  { service: "Діагностика", description: "УЗД, аналізи крові, рентгенографія", price: "700 грн" },
  { service: "Вакцинація", description: "Вакцинація проти інфекційних хвороб", price: "300 грн" },
  { service: "Хірургія", description: "Планові та екстрені операції", price: "від 2000 грн" },
  { service: "Стоматологія", description: "Чистка зубів та видалення каменю", price: "800 грн" },
  { service: "Терапевтичні послуги", description: "Лікування внутрішніх органів", price: "від 1000 грн" },
];

const Veterinary = () => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = 'Ветеринарія';
}, []);

  const handleProfileRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profile/history"); 
      } else {
        navigate("/login"); 
      }
    });
  };

  const handleCardClick = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id)); 
  };
  const toggleTable = () => {
    setIsVisible(!isVisible);
  };

  const galleryImages = [
    { id: 1, src: "/image/center1.jpg", alt:'Огляд собаки лікарям ' },
    { id: 2, src: "/image/center2.jpg", alt:'Кабінет для огляду тварин' }, 
    { id: 3, src: "/image/center3.jpg", alt: 'Операційне відділення' },
    { id: 4, src: "/image/center4.webp", alt: 'Приймальне відділення' },
    { id: 5, src: "/image/center5.jpg", alt:  'Приймальне відділення'}
  ];
  

  return (
    <section className="container">
      <nav className="breadcrumb my-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Головна</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/Services">Послуги</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Ветеринарія
          </li>
        </ol>
      </nav>
      <div className="veterinary-container">
      <h2 className="veterinary-title">Запишіться на прийом просто зараз</h2>
      <p className="veterinary-description">
        Оберіть зручний спосіб запису: зателефонуйте нам або увійдіть до
        особистого кабінету, щоб обрати зручний час онлайн.
      </p>
      <div className="veterinary-buttons">
        <button
          className="veterinary-button"
          onClick={() => (window.location.href = "tel:+380501234567")}
        >
          Подзвонити
        </button>
        <button className="veterinary-button" onClick={handleProfileRedirect}>
          Увійти в кабінет
        </button>
      </div>
      </div>
      <div>
      <div className="veterinary-block mt-4">
        <div className="veterinary-text">
          <h2>Комплексний підхід до здоров'я</h2>
          <p>
            У ветеринарному відділі "One Dog" ми пропонуємо повний спектр
            послуг для вашого улюбленця: від профілактичних оглядів до
            хірургічних втручань. Наші спеціалісти використовують сучасне
            обладнання та новітні методи лікування.
          </p>
        </div>
        <div className="veterinary-image">
          <img src={vet1} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
      </div>
      <div className="veterinary-block reverse">
        <div className="veterinary-image">
        <img src={vet2} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
        <div className="veterinary-text">
          <h2>Вакцинація та профілактика</h2>
          <p>
            Регулярна вакцинація — запорука здоров'я вашого улюбленця. Ми
            працюємо за сучасними протоколами, забезпечуючи надійний захист від
            найпоширеніших захворювань. Оберіть найкраще для свого собаки.
          </p>
        </div>
      </div>
      <div className="veterinary-block">
        <div className="veterinary-text">
          <h2>Хірургія та реабілітація</h2>
          <p>
            Наші хірурги мають багаторічний досвід проведення як планових, так і
            екстрених операцій. Ми також пропонуємо комплексну реабілітацію,
            щоб ваш улюбленець швидко відновився після лікування.
          </p>
        </div>
        <div className="veterinary-image">
        <img src={vet3} alt="veterinary Image" width={'100%'} height={'80%'} />      
        </div>
      </div>
      </div>
      <div className="pricing-container py-5">
      <h1 className="pricing-header text-center mb-4">Ціни на ветеринарні послуги</h1>
     
      <div >
      <div>
      <div className="row g-4">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className={`col-12 col-md-6 col-lg-4`}
            onClick={() => handleCardClick(service.id)}
          >
            <div className={`card h-100 ${expandedCard === service.id ? "border-success shadow" : ""}`}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className={`${service.icon} text-success`} style={{ fontSize: "2.5rem" }}></i>
                </div>
                <h5 className="card-title text-dark">{service.title}</h5>
                <p className="card-text text-muted">{service.description}</p>
                {expandedCard === service.id && (
                  <ul className="list-unstyled mt-3">
                    {service.fullList.map((item, index) => (
                      <li key={index} className="text-muted">
                        - {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      <div>
      <div className="text-center mb-4">
        <button
          className={`btn ${isVisible ? "btn-danger" : "btn-primary"} btn-lg mt-5 `}
          onClick={toggleTable}
        >
          {isVisible ? "Сховати Ціни" : "Показати Ціни"}
        </button>
      </div>
      {isVisible && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-success">
              <tr>
                <th scope="col">Послуга</th>
                <th scope="col">Опис</th>
                <th scope="col">Ціна</th>
              </tr>
            </thead>
            <tbody>
              {priceList.map((item, index) => (
                <tr key={index}>
                  <td className="fw-bold">{item.service}</td>
                  <td>{item.description}</td>
                  <td className="text-success fw-bold">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
      <div className="pricing-info mt-5">
        <h2 className="pricing-info-header text-center">Чому обрати нас?</h2>
        <p className="pricing-info-text text-center">
          Ми використовуємо сучасне обладнання, сертифіковані препарати та пропонуємо індивідуальний підхід до кожного клієнта.
          Наші фахівці — це професіонали з багаторічним досвідом, які завжди готові допомогти вашому улюбленцю.
        </p>
      </div>
    </div>
      </div>
      <div className="mt-5 doctors-container">
      <h1 className="pricing-header fw-bold text-center pt-5 mt-4">Наші Лікарі</h1>
<Swiper
  modules={[Navigation]}
  navigation
  spaceBetween={20}
  slidesPerView={3}
  breakpoints={{
    320: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  }}
  className="doctors-slider"
>
  {vets.vets.map((vets) => (
    <SwiperSlide key={vets.id} className="doctors-slide">
      <div className="doctors-card text-center">
        <img
          src={vets.image}
          className="doctors-card-img m-2 border border-success rounded-circle"
          alt={vets.name}
          width={'250px'}
          height={'250px'}
        />
        <div className="doctors-card-body">
          <h5 className="doctors-card-title">{vets.name}</h5>
          <p className="doctors-card-text">{vets.specialization}</p>
          <p className="doctors-card-text">
            <strong>Графік роботи:</strong> <br />
            {Object.entries(vets.workingHours).map(([day, hours]) => {
              const dayNames = {
                monday: 'Понеділок',
                tuesday: 'Вівторок',
                wednesday: 'Середа',
                thursday: 'Четвер',
                friday: 'П’ятниця',
                saturday: 'Субота',
                sunday: 'Неділя',
              };
              return (
                <span key={day}>
                  {dayNames[day]}: {hours || 'Вихідний'}
                  <br />
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>
      </div>
      <div className="mt-5">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={1}
        slidesPerView={1}
        className="gallery-slider"
      >
        {galleryImages.map((image) => (
          <SwiperSlide key={image.id}>
            <img src={image.src} alt={`Slide ${image.id}`} className="gallery-image"  />
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </section>
  );
};

export default Veterinary;