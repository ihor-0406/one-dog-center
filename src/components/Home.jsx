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
import '../styles/Home.css';
import saveIMG from "/image/saveBlock.jpg";
import post1 from "/image/post1.jpg";
import post2 from "/image/post2.jpg";


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

  // таймер
  const updateTimer = () => {
    const targetDate = new Date(new Date().getFullYear(), 11, 23, 0, 0, 0); // 23.12.24
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

  //запуск таймера
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * reviewTexts.length);
    setRandomReview(reviewTexts[randomIndex]);
  }, []); 

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");

      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      snowflake.style.opacity = `${Math.random() * 0.5 + 0.5}`;
      snowflake.style.fontSize = `${Math.random() * 20 + 20}px`;

      const container = document.querySelector(".show-container");
      if (container) {
        container.appendChild(snowflake);
      }

      setTimeout(() => {
        snowflake.remove();
      }, 5000);
    };

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
const descriptions = {
            labrador: "Лабрадор — відданий, розумний та енергійний собака, ідеально підходить для сімейного життя.",
            german_shepherd: "Німецька вівчарка — сміливий, надійний і високорозумний захисник.",
            bulldog: "Бульдог — спокійний і люблячий компаньйон, який добре адаптується до квартирного життя.",
            poodle: "Пудель — дуже розумний, активний і легко навчається собака, що обожнює увагу.",
            pomeranian: "Померанський шпіц — жвавий і енергійний собака з великим серцем.",
            chihuahua: "Чихуахуа — маленький, але хоробрий і відданий компаньйон.",
            dalmatian: "Далматинець — грайливий і енергійний собака, який потребує багато руху.",
            doberman: "Доберман — вірний охоронець і сміливий компаньйон.",
            akita: "Акита — величний собака з сильною особистістю, що славиться відданістю.",
            pug: "Мопс — веселий і дружелюбний собака, який легко знаходить спільну мову з людьми.",
            beagle: "Бігль — допитливий, грайливий і дуже соціальний собака.",
            husky: "Хаскі — енергійний і незалежний собака з вражаючою витривалістю.",
            rottweiler: "Ротвейлер — впевнений, захисний і дуже вірний собака.",
            yorkshire_terrier: "Йоркширський тер'єр — маленький, але сміливий і грайливий компаньйон.",
            golden_retriever: "Голден ретрівер — доброзичливий і дуже розумний собака, що легко навчається.",
            boxer: "Боксер — життєрадісний і енергійний собака, який любить дітей.",
            shih_tzu: "Ши-тцу — ласкавий, чарівний собака, який обожнює увагу.",
            dachshund: "Такса — маленький, але сміливий і активний мисливець.",
            border_collie: "Бордер коллі — надзвичайно розумний і енергійний собака.",
            saint_bernard: "Сенбернар — лагідний гігант, відомий своїм добрим серцем.",
            alaskan_malamute: "Аляскинський маламут — сильний і витривалий собака, який любить активний спосіб життя.",
            australian_shepherd: "Австралійська вівчарка — розумний, енергійний і відданий компаньйон.",
            basset_hound: "Бассет хаунд — спокійний і доброзичливий собака з сильним нюхом.",
            bernese_mountain_dog: "Бернський зенненхунд — великий і лагідний собака, відомий своєю відданістю.",
            chow_chow: "Чау-чау — гордий і незалежний собака з унікальним виглядом.",
            cocker_spaniel: "Кокер спанієль — грайливий і люблячий собака, який обожнює прогулянки.",
            greyhound: "Грейхаунд — швидкий і елегантний собака, що має спокійну натуру.",
            jack_russell_terrier: "Джек рассел тер'єр — енергійний, веселий і дуже активний собака.",
            maltese: "Мальтійська болонка — маленький і чарівний собака, який любить увагу.",
            newfoundland: "Ньюфаундленд — лагідний гігант, відомий своїм плаванням і рятувальними здібностями.",
            pit_bull: "Пітбуль — сміливий і захисний собака, що потребує правильного виховання.",
            pomsky: "Помскі — маленький, грайливий і дуже симпатичний собака.",
            samoyed: "Самоїд — дружелюбний і завжди усміхнений собака, відомий своєю білою шерстю.",
            siberian_husky: "Сибірський хаскі — витривалий і активний собака з неймовірною витривалістю.",
            weimaraner: "Веймаранер — енергійний і розумний мисливський собака.",
            westie: "Вест хайленд тер'єр — веселий і енергійний маленький собака.",
            whippet: "Віпет — швидкий і граціозний собака, який обожнює комфорт.",
            australian_cattle_dog: "Австралійський пастуший собака — енергійний і працелюбний компаньйон.",
            bloodhound: "Бладхаунд — доброзичливий собака з неймовірно чутливим нюхом.",
            cane_corso: "Кане корсо — впевнений і захисний собака, який відмінно ладнає з дітьми.",
            great_dane: "Німецький дог — величний гігант, який славиться своїм лагідним характером.",
            irish_setter: "Ірландський сетер — енергійний і витончений собака, який любить природу.",
            mastiff: "Мастиф — сильний і впевнений собака, що славиться своїм спокоєм.",
            vizsla: "Візсла — активний і розумний мисливський собака.",
            shar_pei: "Шарпей — унікальний собака з глибокими складками і відданим характером.",
            boston_terrier: "Бостон тер'єр — маленький і елегантний собака з веселою натурою.",
            cavalier_king_charles_spaniel: "Кавалер кінг чарльз спанієль — люблячий і ніжний собака, ідеальний для сімейного життя.",
 };
   const [dogBreedsWithImages, setDogBreedsWithImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
          
    useEffect(() => {
      const fetchDogBreeds = async () => {
        try {
          const response = await fetch("https://dog.ceo/api/breeds/list/all");
          const breedData = await response.json();
          const allBreeds = Object.keys(breedData.message);
  
          const filteredBreeds = allBreeds.filter((breed) =>
            descriptions.hasOwnProperty(breed)
          );
  
          const dogBreeds = await Promise.all(
            filteredBreeds.map(async (breed) => {
              const imageResponse = await fetch(
                `https://dog.ceo/api/breed/${breed}/images/random`
              );
              const imageData = await imageResponse.json();
  
              return {
                name: breed,
                description: descriptions[breed],
                image: imageData.message,
              };
            })
          );
  
          setDogBreedsWithImages(dogBreeds);
          setLoading(false);
        } catch (error) {
          setError("Помилка при завантаженні даних про собак.");
          setLoading(false);
        }
      };
  
      fetchDogBreeds();
    }, []);
  
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      );
    }
  
    if (error) {
      return <div>{error}</div>;
    }
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
                {
                  question: "Як навчити собаку виконувати команди?",
                  answer:
                    "Навчання має бути послідовним і позитивним. Використовуйте нагороди, такі як ласощі або похвала, щоб мотивувати собаку.",
                },
                {
                  question: "Як доглядати за шерстю собаки?",
                  answer:
                    "Регулярне розчісування допомагає зберегти шерсть у хорошому стані. Деякі породи потребують стрижки або спеціального догляду.",
                },
                {
                  question: "Чи потрібно одягати собаку в холодну погоду?",
                  answer:
                    "Маленьким або короткошерстим собакам може знадобитися теплий одяг у холодну погоду. Це допомагає запобігти переохолодженню.",
                },
                {
                  question: "Що робити, якщо собака боїться гучних звуків?",
                  answer:
                    "Спробуйте створити безпечне місце для собаки та використовуйте методи заспокоєння. За потреби зверніться до ветеринара або кінолога.",
                },
                {
                  question: "Як підготувати собаку до візиту до ветеринара?",
                  answer:
                    "Підготовка до візиту включає привчання собаки до перенесення, заспокійливий тон і забезпечення ласощів після відвідування.",
                },
              ];
    return (
        <section className="container">
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
    <div className="container my-5 ">
    <h1 className="text-center">Породи собак</h1>
      <ul className="row list-unstyled dogsInfo">
        {dogBreedsWithImages.map((dog, index) => (
          <li key={index} className="col-md-6  mb-4">
            <div className="card">
              <img
                src={dog.image}
                alt={dog.name}
                className="card-img"
                style={{ height: "200px", objectFit: "cover", objectPosition:"center" }}
              />
              <div className="card-body">
                <h5 className="card-title text-success fs-3 fw-bold">{dog.name}</h5>
                <p className="card-text fw-bolder">{dog.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
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