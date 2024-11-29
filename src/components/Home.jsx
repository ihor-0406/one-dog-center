import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Navigation, Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import './Home.css';
import saveIMG from "/image/saveBlock.jpg";
import post1 from "/image/post1.jpg";
import post2 from "/image/post2.jpg";
import newsDog from "/image/imageAmimal.png"


function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const [randomReview, setRandomReview] = useState("");

  // Масив із варіантами відгуків
  const reviewTexts = [
    "Прекрасне обслуговування та турбота про мого улюбленця. Всім рекомендую!",
    "Дуже задоволений якістю послуг та увагою до мого улюбленця!",
    "Найкращий ветеринарний центр! Завжди впевнений у професіоналізмі команди.",
    "Дякую за доброту та турботу про нашого улюбленця.",
    "Рекомендую всім! Чудовий сервіс і приємний персонал.",
    "Мій собака завжди щасливий після візиту сюди. Дякую за вашу роботу!"
  ];

  // Функция для обновления таймера
  const updateTimer = () => {
    const targetDate = new Date(new Date().getFullYear(), 11, 23, 0, 0, 0); // 23 декабря текущего года
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(
        `${days} днів ${hours} годин ${minutes} хвилин ${seconds} секунд`
      );
    } else {
      setTimeLeft("Акція завершена!");
    }
  };

  // useEffect для запуска таймера
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect для случайного отзыва (генерация один раз при загрузке)
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * reviewTexts.length);
    setRandomReview(reviewTexts[randomIndex]);
  }, []); // Генерируем отзыв только один раз

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");

      // Случайное положение и стили снежинки
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      snowflake.style.opacity = `${Math.random() * 0.5 + 0.5}`;
      snowflake.style.fontSize = `${Math.random() * 20 + 20}px`;

      // Находим контейнер для снежинок
      const container = document.querySelector(".show-container");
      if (container) {
        container.appendChild(snowflake);
      }

      setTimeout(() => {
        snowflake.remove();
      }, 5000);
    };

    // Запуск интервала для создания снежинок
    const interval = setInterval(createSnowflake, 200);

    return () => clearInterval(interval);
  }, []);

  // Завантаження даних користувачів із API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://randomuser.me/api/?results=10');
        const data = await response.json();
        setUsers(data.results);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    }
    fetchUsers();
  }, []);

  // Функція для перенаправлення користувача
  const handleProfileRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/Profile/History');
      } else {
        navigate('/login');
      }
    });
  };
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchNews = async () => {
          const apiKey = "008eb5e12ac543abb1d037e828630907";
          const url = `https://newsapi.org/v2/everything?q=тварини OR ветеринарія OR пес OR кішка&language=uk&pageSize=10&apiKey=${apiKey}`;

          try {
              const response = await fetch(url);
              if (!response.ok) {
                  throw new Error("Помилка при завантаженні новин");
              }
              const data = await response.json();
              setArticles(data.articles);
              setLoading(false);
          } catch (error) {
              setError(error.message);
              setLoading(false);
          }
      };

      fetchNews();
  }, []);

  const questionsAndAnswers = [
      {
          question: "Скільки разів на день потрібно гуляти з собакою?",
          answer:
              "Дорослих собак рекомендується вигулювати 2–3 рази на день. Щенята потребують більше прогулянок, щоб привчитися до гігієни.",
      },
      {
          question: "Як часто потрібно годувати собаку?",
          answer:
              "Дорослих собак годують двічі на день — вранці та ввечері. Щенят потрібно годувати частіше, до 4–6 разів на день залежно від віку.",
      },
      {
          question: "Чи потрібно чистити зуби собаці?",
          answer:
              "Так, регулярне чищення зубів допомагає запобігти хворобам ясен і зубів. Використовуйте спеціальні щітки та пасти для собак.",
      },
      {
          question: "Як обрати правильний корм для собаки?",
          answer:
              "Обирайте корм відповідно до віку, розміру та активності собаки. Проконсультуйтеся з ветеринаром для вибору найкращого варіанту.",
      },
      {
          question: "Що робити, якщо собака постійно чухається?",
          answer:
              "Чухання може бути викликане алергією, паразитами чи шкірними захворюваннями. Зверніться до ветеринара для діагностики та лікування.",
      },
  ];

  if (loading) {
      return <div>Завантаження новин...</div>;
  }

  if (error) {
      return <div>Помилка: {error}</div>;
  }
    return (
        <section className="container">
            {/* Блок із загальною інформацією про центр */}
            <div className="container home-page">
                <div className="center-info">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="poppins-semibold fw-medium logoOnegog">
                            One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span> Center
                        </h2>
                    </div>
                    <div className="col-12">
                        <p>
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Повний спектр послуг для домашніх улюбленців. <br />
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Висококваліфіковані ветеринари та кінологи. <br />
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Професійний грумінг для доглянутого вигляду.<br />
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#000000" }} /> Індивідуальний підхід та турбота про кожного улюбленця.
                        </p>
                    </div>
                    <div className="col-12 d-flex justify-content-center gap-2 mb-3">
                        <Link to="/services" className="btn btn-primary">Дізнатись більше про наші послуги</Link>
                    </div>
                </div>
            </div>

            {/* Блок для запису на прийом */}
            <div className="container py-5 ">
                <div className="p-2 mb-4 bg-light rounded-3 shadow appointment">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold text-primary">Запишіться на прийом просто зараз</h1>
                        <p className="col-md-8 fs-4 text-muted">
                        Оберіть зручний спосіб запису: зателефонуйте нам або увійдіть до особистого кабінету, щоб обрати зручний час онлайн.
                        </p>
                        <div className="d-flex flex-column flex-md-row gap-3">
                            <a href="tel:+380123456789" className="btn btn-success btn-lg">
                                Подзвонити
                            </a>
                            <button onClick={handleProfileRedirect} className="btn btn-primary btn-lg">
                                Зареєструватися
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grooming-promotion">
             <div className="promotion-content">
               <div className="textSection">
                   <h1 className='title'>Грумінг для вашої собаки</h1>
                    <p className="px-3 subtitle">
                    Встигніть записатися на професійний грумінг до <span className='highlight'>23 грудня</span> та
                    отримайте знижку <span className='highlight'>20%!</span>
                    </p>
              <div className="timer"><span className='time-text'>{timeLeft}</span></div>
          </div>
            <div className="show-container">
              <img className='grooming-img'
                src={saveIMG}
                alt="Груминг"
                width={'350px'}
                height={'450px'}
               />
            </div>
      </div>
    </div>
    <div className="container mt-5 ">
            <div className="post-section mt-5 position-relative">
                <div className="lapki-container">
                    {[...Array(10)].map((_, i) => (
                        <div
                            className="lapka"
                            key={i}
                            style={{
                                left: `${Math.random() * 90}%`,
                                top: `${Math.random() * 90}%`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        >
                            <FontAwesomeIcon icon={faPaw} />
                        </div>
                    ))}
                </div>
                <div className="row align-items-center">
                    <div className="col-md-8 post-text">
                        <h1>Місце, де народжується дружба</h1>
                        <p>
                            Наш центр — це місце, де починається справжня дружба. Ми піклуємось про кожну собаку, щоб вона відчувала себе потрібною та коханою. <FontAwesomeIcon icon="fa-solid fa-paw" style={{color: "#41b995",}} />
                            <br />
                            <br />
                            Наша команда завжди поруч, щоб знайти для кожного улюбленця найкращу родину. Завітайте до нас та переконайтесь, що тут здійснюються мрії! <FontAwesomeIcon icon="fa-solid fa-heart" style={{color: "#bc1d01",}} />
                        </p>
                    </div>
                    <div className="col-md-4 post-image">
                        <img src={post1} alt="Місце, де народжується дружба" className="img-fluid rounded" />
                    </div>
                </div>
            </div>

            <div className="post-section mb-5 position-relative">
                <div className="lapki-container">
                    {[...Array(10)].map((_, i) => (
                        <div
                            className="lapka"
                            key={i}
                            style={{
                                left: `${Math.random() * 90}%`,
                                top: `${Math.random() * 90}%`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        >
                            <FontAwesomeIcon icon={faPaw} />
                        </div>
                    ))}
                </div>
                <div className="row align-items-center">
                    <div className="col-md-4 post-image">
                        <img src={post2} alt="Ми піклуємось про кожного" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-8 post-text">
                        <h1>Ми піклуємось про кожного</h1>
                        <p>
                            Ми у "OneDog" знаємо, наскільки важливою є турбота. Наша місія — допомогти кожній собаці знайти люблячу родину. <FontAwesomeIcon icon="fa-solid fa-sun" style={{color: "#FFD43B",}} />
                            <br />
                            <br />
                            Цей чотирилапий друг вже готовий стати частиною вашого життя. Давайте разом подаруємо йому новий дім, де його любитимуть і піклуватимуться! <FontAwesomeIcon icon="fa-solid fa-house" style={{color: "#2a896c",}} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
            {/* Блок із відгуками */}
            <div className="reviews-section mt-5">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    spaceBetween={20}
                    slidesPerView={3}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {users.map((user, index) => (
                        <SwiperSlide key={index}>
                            <div className="card h-100 shadow-sm review-card cardWiper">
                                {/* Аватар */}
                                <img
                                    src={user.picture.large}
                                    alt={`${user.name.first} ${user.name.last}`}
                                    className="card-img-top rounded-circle mx-auto mt-3"
                                    style={{ width: "80px", height: "80px" }}
                                />
                                <div className="card-body text-center">
                                    {/* Відгук */}
                                    <p className="card-text text-muted mb-3">"{randomReview}"</p>
                                    {/* Нік */}
                                    <h5 className="card-title">{user.name.first} {user.name.last}</h5>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="container containerNews my-3 d-flex justify-content-between gap-2">
    <div className='newsBlock col-md-8'>
       <div className="news-column">
        <h2>Новини про тварин</h2>
        <ul className="news-list">
            {articles.map((article, index) => (
                <li key={index} className="news-item">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <h3>{article.title}</h3>
                    </a>
                    <p>{article.description}</p>
                    <small>Джерело: {article.source.name}</small>
                </li>
            ))}
        </ul>
    </div>
    <div className="imgNews d-flex justify-content-center">
        <img src={newsDog} alt="News Animals" width="100%" />
    </div>
    </div>
    <div className="info-column col-md-4">
        <h2>Питання та відповіді</h2>
        <ul className="qa-list">
            {questionsAndAnswers.map((qa, index) => (
                <li key={index} className="qa-item">
                    <h3>{qa.question}</h3>
                    <p>{qa.answer}</p>
                </li>
            ))}
        </ul>
    </div>
</div>
        </section>
    );
}

export default Home;