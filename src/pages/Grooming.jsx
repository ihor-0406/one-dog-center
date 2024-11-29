import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import groom1 from "/image/grooming1.jpg";
import groom2 from "/image/grooming2.jpg";
import groom3 from "/image/grooming3.jpg";
import "./Grooming.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import vets from "../data/vets.json";





const grooming=()=>{

    useEffect(() => {
        document.title = 'Грумінг';
    }, []);

    const galleryImages = [
      { id: 1, src: "/image/grooming01.jpg", alt:'Огляд собаки лікарям ' },
      { id: 2, src: "/image/grooming02.jpg", alt:'Кабінет для огляду тварин' }, 
      { id: 3, src: "/image/grooming03.jpg", alt: 'Операційне відділення' },
      { id: 4, src: "/image/grooming05.jpg", alt: 'Приймальне відділення' },
      { id: 5, src: "/image/grooming06.jpg", alt:  'Приймальне відділення'}
    ];

    const handleProfileRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profile/history"); // Если пользователь авторизован
      } else {
        navigate("/login"); // Если пользователь не авторизован
      }
    });
  };
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
          Грумінг
          </li>
        </ol>
      </nav>
      <div className="veterinary-container ">
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
         {/* Первый блок: текст слева, изображение справа */}
      <div className="veterinary-block  mt-4">
        <div className="veterinary-text ">
          <h2>Комплексний догляд та стрижка</h2>
          <p>
          Наш центр грумінгу пропонує професійний догляд за шерстю вашого улюбленця. Включає індивідуально підібрані стрижки, догляд за шерстю, вухами та лапами. Наші спеціалісти працюють з урахуванням особливостей породи та побажань власника.
          </p>
        </div>
        <div className="veterinary-image">
          <img src={groom1} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
      </div>

      {/* Второй блок: изображение слева, текст справа */}
      <div className="veterinary-block reverse">
        <div className="veterinary-image">
        <img src={groom2} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
        <div className="veterinary-text">
          <h2>Косметичні процедури та догляд</h2>
          <p>
          Ми допоможемо вашому улюбленцю виглядати охайно та почуватися комфортно. До наших послуг входять купання з використанням спеціалізованих шампунів, маски для шерсті, розчісування, а також обробка пазурів і подушечок лап.
          </p>
        </div>
      </div>

      {/* Третий блок: текст слева, изображение справа */}
      <div className="veterinary-block">
        <div className="veterinary-text">
          <h2>Догляд за лапами та здоров’ям шкіри</h2>
          <p>
          Якщо ваш улюбленець має чутливу шкіру або потребує спеціального догляду, наші фахівці забезпечать належний підхід. Ми використовуємо лише сертифіковану косметику, яка безпечна для вашого улюбленця.
          </p>
        </div>
        <div className="veterinary-image">
        <img src={groom3} alt="veterinary Image" width={'100%'} height={'80%'} />      
        </div>
      </div>
      </div>
      <div className="kinology-pricing py-5">
      <div className="container">
  <div className="text-center mb-5">
    <h2 className="pricing-title">Тарифи центру грумінгу</h2>
    <p className="pricing-subtitle">
      Оберіть оптимальний план для догляду за вашим улюбленцем
    </p>
  </div>
  <div className="row row-cols-1 row-cols-md-3 g-4">
    {/* Basic Plan */}
    <div className="col">
      <div className="card pricing-card h-100">
        <div className="card-header text-center text-uppercase bg-light">
          <h4>Базовий</h4>
        </div>
        <div className="card-body text-center">
          <h5 className="card-title pricing-price">300 ₴/візит</h5>
          <ul className="list-unstyled">
            <li>Стрижка шерсті</li>
            <li>Обробка пазурів</li>
            <li>Очищення вух</li>
          </ul>
        </div>
      </div>
    </div>
    {/* Standard Plan */}
    <div className="col">
      <div className="card pricing-card h-100">
        <div className="card-header text-center text-uppercase bg-light">
          <h4>Стандартний</h4>
        </div>
        <div className="card-body text-center">
          <h5 className="card-title pricing-price">500 ₴/візит</h5>
          <ul className="list-unstyled">
            <li>Повний комплекс догляду</li>
            <li>Купання зі спеціальними шампунями</li>
            <li>Розчісування шерсті</li>
          </ul>
        </div>
      </div>
    </div>
    {/* Premium Plan */}
    <div className="col">
      <div className="card pricing-card h-100">
        <div className="card-header text-center text-uppercase bg-light">
          <h4>Преміум</h4>
        </div>
        <div className="card-body text-center">
          <h5 className="card-title pricing-price">800 ₴/візит</h5>
          <ul className="list-unstyled">
            <li>Індивідуальний догляд</li>
            <li>Косметичні процедури</li>
            <li>Консультація фахівця</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  {/* Таблиця порівняння */}
  <div className="comparison-table mt-5">
    <h3 className="text-center mb-4">Порівняння тарифів</h3>
    <table className="table table-hover">
      <thead className="table-success">
        <tr>
          <th scope="col">Особливості</th>
          <th scope="col">Базовий</th>
          <th scope="col">Стандартний</th>
          <th scope="col">Преміум</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Стрижка шерсті</td>
          <td>Так</td>
          <td>Так</td>
          <td>Так</td>
        </tr>
        <tr className="table-primary">
          <td>Обробка пазурів</td>
          <td>Так</td>
          <td>Так</td>
          <td>Так</td>
        </tr>
        <tr>
          <td>Купання</td>
          <td>Ні</td>
          <td>Так</td>
          <td>Так</td>
        </tr>
        <tr className="table-warning">
          <td>Косметичні процедури</td>
          <td>Ні</td>
          <td>Ні</td>
          <td>Так</td>
        </tr>
        <tr>
          <td>Консультація фахівця</td>
          <td>Ні</td>
          <td>Ні</td>
          <td>Так</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
    </div>
    <div className="mt-5 doctors-container">
    <h1 className="pricing-header fw-bold text-center pt-5 mt-4">Наші Спеціалісти</h1>
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
  {vets.groomingSpecialists.map((groomingSpecialists) => (
    <SwiperSlide key={groomingSpecialists.id} className="doctors-slide">
      <div className="doctors-card text-center">
        <img
          src={groomingSpecialists.image}
          className="doctors-card-img m-2 border border-success rounded-circle"
          alt={groomingSpecialists.name}
          width={'250px'}
          height={'250px'}
        />
        <div className="doctors-card-body">
          <h5 className="doctors-card-title">{groomingSpecialists.name}</h5>
          <p className="doctors-card-text">{groomingSpecialists.specialization}</p>
          <p className="doctors-card-text">
            <strong>Графік роботи:</strong> <br />
            {Object.entries(groomingSpecialists.workingHours).map(([day, hours]) => {
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
      <div className="mt-5 ">
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
export default grooming;