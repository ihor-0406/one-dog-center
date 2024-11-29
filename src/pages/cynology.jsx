import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import cyn1 from "/image/cynology1.jpg";
import cyn2 from "/image/cynology2.jpeg";
import cyn3 from "/image/cynology3.jpg";
import "./cynology.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import vets from "../data/vets.json";





const cynology=()=>{

    useEffect(() => {
        document.title = 'Кінологічний центр';
    }, []);

    const galleryImages = [
      { id: 1, src: "/image/kyno-dog1.jpg", alt:'Тренер тренерує пса' },
      { id: 2, src: "/image/kyno-dog2.jpg", alt:'Три німецкі вівчарки' }, 
      { id: 3, src: "/image/kyno-dog4.jpg", alt: 'Дівчина грає з псом' },
      { id: 4, src: "/image/kyno-dog5.jpg", alt: 'Пес з людиною ' },
      { id: 5, src: "/image/kyno-dog6.jpg", alt:  'Пес з людиною'}
    ];

    const handleProfileRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profile/history"); 
      } else {
        navigate("/login"); 
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
            Кінологічний центр
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
          <h2>Комплексна підготовка та дресирування</h2>
          <p>
          У нашому кінологічному центрі ми пропонуємо індивідуальні та групові тренування для вашого собаки. Наші спеціалісти використовують сучасні методики дресирування, спрямовані на покращення поведінки та зміцнення зв’язку між собакою та власником.
          </p>
        </div>
        <div className="veterinary-image">
          <img src={cyn1} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
      </div>

      {/* Второй блок: изображение слева, текст справа */}
      <div className="veterinary-block reverse">
        <div className="veterinary-image">
        <img src={cyn2} alt="veterinary Image" width={'100%'} height={'80%'} />
        </div>
        <div className="veterinary-text">
          <h2>Соціалізація та розвиток навичок</h2>
          <p>
          Ми допомагаємо вашому улюбленцю адаптуватися до різних умов і ситуацій через спеціальні програми соціалізації. Це включає тренування на відкритих майданчиках, спілкування з іншими собаками та навчання новим командам.
          </p>
        </div>
      </div>

      {/* Третий блок: текст слева, изображение справа */}
      <div className="veterinary-block">
        <div className="veterinary-text">
          <h2>Терапевтична та корекційна робота</h2>
          <p>
          Якщо у вашого собаки є проблеми з поведінкою, наші кінологи проведуть детальний аналіз та розроблять індивідуальний план корекції. Ми допоможемо вашому улюбленцю стати слухняним та спокійним.
          </p>
        </div>
        <div className="veterinary-image">
        <img src={cyn3} alt="veterinary Image" width={'100%'} height={'80%'} />      
        </div>
      </div>
      </div>
      <div className="kinology-pricing py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="pricing-title">Тарифи кінологічного центру</h2>
          <p className="pricing-subtitle">
            Оберіть оптимальний план для тренувань вашого собаки
          </p>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Free Plan */}
          <div className="col">
            <div className="card pricing-card h-100">
              <div className="card-header text-center text-uppercase bg-light">
                <h4>Безкоштовний</h4>
              </div>
              <div className="card-body text-center">
                <h5 className="card-title pricing-price">0 ₴/місяць</h5>
                <ul className="list-unstyled">
                  <li>1 індивідуальне тренування</li>
                  <li>Доступ до базового обладнання</li>
                  <li>Поради від тренера</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Pro Plan */}
          <div className="col">
            <div className="card pricing-card h-100">
              <div className="card-header text-center text-uppercase bg-light">
                <h4>Професійний</h4>
              </div>
              <div className="card-body text-center">
                <h5 className="card-title pricing-price">500 ₴/місяць</h5>
                <ul className="list-unstyled">
                  <li>5 індивідуальних тренувань</li>
                  <li>Доступ до сучасного обладнання</li>
                  <li>Консультація кінолога</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Enterprise Plan */}
          <div className="col">
            <div className="card pricing-card h-100">
              <div className="card-header text-center text-uppercase bg-light">
                <h4>Максимальний</h4>
              </div>
              <div className="card-body text-center">
                <h5 className="card-title pricing-price">1000 ₴/місяць</h5>
                <ul className="list-unstyled">
                  <li>10 індивідуальних тренувань</li>
                  <li>Соціалізація та групові заняття</li>
                  <li>Повна підтримка кінолога</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Таблица сравнения */}
        <div className="comparison-table mt-5">
          <h3 className="text-center mb-4">Порівняння тарифів</h3>
          <table className="table table-hover">
            <thead className="table-success">
              <tr>
                <th scope="col">Особливості</th>
                <th scope="col">Безкоштовний</th>
                <th scope="col">Професійний</th>
                <th scope="col">Максимальний</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Кількість тренувань</td>
                <td>1</td>
                <td>5</td>
                <td>10</td>
              </tr>
              <tr className="table-primary">
                <td>Доступ до обладнання</td>
                <td>Базове</td>
                <td>Сучасне</td>
                <td>Сучасне</td>
              </tr>
              <tr>
                <td>Соціалізація</td>
                <td>Ні</td>
                <td>Ні</td>
                <td>Так</td>
              </tr>
              <tr className="table-warning">
                <td>Підтримка кінолога</td>
                <td>Поради</td>
                <td>Консультація</td>
                <td>Повна підтримка</td>
              </tr>
              <tr>
                <td>Групові заняття</td>
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
    <h1 className="pricing-header fw-bold text-center pt-5 mt-4">Наші Тренери</h1>
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
  {vets.kynologists.map((kynologist) => (
    <SwiperSlide key={kynologist.id} className="doctors-slide">
      <div className="doctors-card text-center">
        <img
          src={kynologist.image}
          className="doctors-card-img m-2 border border-success rounded-circle"
          alt={kynologist.name}
          width={'250px'}
          height={'250px'}
        />
        <div className="doctors-card-body">
          <h5 className="doctors-card-title">{kynologist.name}</h5>
          <p className="doctors-card-text">{kynologist.specialization}</p>
          <p className="doctors-card-text">
            <strong>Графік роботи:</strong> <br />
            {Object.entries(kynologist.workingHours).map(([day, hours]) => {
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
export default cynology;