import React, {useState} from "react";
import "../styles/About.css";
import about1 from "/image/about1.jpg";
import about2 from "/image/about2.jpg";
import about3 from "/image/about3.jpg";
import about4 from "/image/about4.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";


const about =() =>{
  const [hoveredSponsor, setHoveredSponsor] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const sponsors = [
    {
      id: 1,
      name: 'PetFood Company',
      description: 'Лідер у виробництві кормів для собак.',
      logo: '/image/sponsors/dogCare.png',
    },
    {
      id: 2,
      name: 'DogCare Products',
      description: 'Інноваційні продукти для догляду за собаками.',
      logo: '/image/sponsors/happypaws.png',
    },
    {
      id: 3,
      name: 'HappyPaws Foundation',
      description: 'Фонд підтримки здоров\'я домашніх тварин.',
      logo: "/image/sponsors/petFood.png",
    },
    {
      id: 4,
      name: 'VetTech Innovations',
      description: 'Розробка сучасного ветеринарного обладнання.',
      logo: '/image/sponsors/vettech.png',
    },
    {
      id: 5,
      name: 'HealthyPaws Nutrition',
      description: 'Збалансоване харчування для собак.',
      logo: '/image/sponsors/HealthyPaws.png',
    },
    {
      id: 6,
      name: 'BarkBright Toys',
      description: 'Іграшки, які роблять собак щасливими.',
      logo: '/image/sponsors/Bark-Bright.png',
    },
  ];
    const galleryImages = [
        { id: 1, src: "/image/about01.jpg", alt:'Осмотр пса' },
        { id: 2, src: "/image/about02.jpg", alt:'Осмотр пса' }, 
        { id: 3, src: "/image/about03.webp", alt: 'Осмотр пса' },
        { id: 4, src: "/image/about04.jpg", alt: 'Тренування пса' },
        { id: 5, src: "/image/about05.jpg", alt:  'Тренування пса'},
        { id: 6, src: "/image/about06.jpg", alt:  'пес в лісі'},
        { id: 7, src: "/image/about07.jpeg", alt:  'Грумінг пса'},
        { id: 8, src: "/image/about08.jpg", alt:  'Грумінг пса'},
        { id: 9, src: "/image/about09.jpg", alt:  'Грумінг пса'}
      ];
      const handleMouseEnter = (sponsor, event) => {
        setHoveredSponsor(sponsor);
        setCursorPosition({ x: event.clientX, y: event.clientY });
      };
    
      const handleMouseMove = (event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
      };
    
      const handleMouseLeave = () => {
        setHoveredSponsor(null);
      };
  
    return(
        <section class="container about-us-description mt-3">
            <nav aria-label="breadcrumb">
               <ol className="breadcrumb my-4">
                   <li className="breadcrumb-item"><Link to="/">Головна</Link></li>
                   <li className="breadcrumb-item active" aria-current="page">Про Нас</li>
               </ol>
           </nav>
  <div class="d-flex justify-content-between align-items-center about-intro">
    <div className=" p-3 text-center">
        <h1>Про центр "<span className="logoOnegog m-0">One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span></span> "</h1>
    <p>
      Ласкаво просимо до ветеринарного центру "One Dog" — місця, де ваші улюбленці отримують найкращий догляд, 
      увагу та лікування. Ми спеціалізуємося на комплексних послугах для собак, щоб забезпечити їхнє здоров'я 
      та довголіття.
    </p>
    </div>
    <div >
        <img src={about1} alt="чотири пса" width={'100%'} height={'80%'}/>
    </div>
  </div>

  <div class="d-flex justify-content-between align-items-center about-values">
    <div className="col-sm-5">
        <img src={about2} alt="огляд пса лікарем" width={"100%"} height={"80%"} />
    </div>
    <div className="p-3">
       <h2 className="text-center">Наша місія</h2>
    <p>
    У центрі “One Dog” ми прагнемо створити середовище, де кожен улюбленець відчуває себе особливим. Наша місія — забезпечити професійний догляд та підтримку, орієнтуючись на потреби кожної собаки. Ми віримо, що здоров’я та щастя ваших улюбленців є запорукою гармонійних відносин між господарями та їхніми чотирилапими друзями.
    Ми дбаємо про те, щоб кожне звернення до нашого центру залишало у вас лише позитивні враження, а ваш песик отримував найкращий сервіс та турботу.
    </p> 
    </div>
  </div>
  <div class="col-12 text-center mt-5  about-vision ">
    <h2 >Наші цінності</h2>
    <ul className="list-unstyled ">
      <li><strong>Професіоналізм:</strong> Кожен член нашої команди має високу кваліфікацію та багаторічний досвід роботи.</li>
      <li><strong>Індивідуальний підхід:</strong> Ми враховуємо потреби кожної собаки, щоб забезпечити максимально ефективний догляд.</li>
      <li><strong>Довіра:</strong> Ми прагнемо будувати чесні та відкриті стосунки з нашими клієнтами.</li>
      <li><strong>Інновації:</strong> Ми використовуємо сучасне обладнання та найновіші методи лікування.</li>
    </ul>
  </div>
  <div>
    <img src={about3} alt="собаки" width={'100%'} height={'70%'}/>
  </div>
  <div className="d-flex justify-content-between align-items-center about-gols-statistics">
    <div >
     <div class="about-goals">
    <h2>Чому обирають нас?</h2>
    <p>
      Центр "One Dog" — це більше, ніж ветеринарний заклад. Ми створили простір, де ваші улюбленці відчувають турботу, 
      а ви — впевненість у їхньому здоров'ї. Наші основні переваги:
    </p>
    <ul>
      <li>Сучасне обладнання для діагностики та лікування.</li>
      <li>Широкий спектр послуг: ветеринарія, грумінг, кінологічний центр.</li>
      <li>Зручний графік роботи, щоб ви могли відвідати нас у зручний час.</li>
      <li>Доступні ціни та прозора система оплати.</li>
    </ul>
  </div>

  <div class="about-statistics">
    <h2>Цікаві факти про наш центр</h2>
    <ul>
      <li><strong>10+ років досвіду:</strong> Ми працюємо для вашого спокою та здоров'я ваших улюбленців.</li>
      <li><strong>5000+ здорових собак:</strong> Ми пишаємося кожною історією успіху.</li>
      <li><strong>30+ фахівців:</strong> Наша команда включає найкращих ветеринарів, грумерів і кінологів.</li>
    </ul>
  </div>
  </div>
  <div >
    <img src={about4} alt="dog" width={'100%'} height={'75%'}/>
  </div>
  </div>
  
 

  <div class="text-center about-message">
    <h2>Наша обіцянка</h2>
    <p>
      Ми обіцяємо, що кожен ваш візит до нашого центру стане приємним досвідом для вас і вашого улюбленця. 
      Ваш спокій і їхнє здоров'я — наш пріоритет.
    </p>
  </div>
  <div className="sponsors-section container">
      <div className="row justify-content-center align-items-center">
        {sponsors.map((sponsor) => (
          <div
            className="col-md-2 col-sm-4 mb-4 text-center sponsor-item"
            key={sponsor.id}
            onMouseEnter={(event) => handleMouseEnter(sponsor, event)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="sponsor-logo img-fluid"
              
            />
          </div>
        ))}
      </div>

      {hoveredSponsor && (
        <div
          className="sponsor-tooltip"
          style={{
            top: cursorPosition.y + 15 + 'px',
            left: cursorPosition.x + 15 + 'px',
          }}
        >
          <strong>{hoveredSponsor.name}</strong>
          <p>{hoveredSponsor.description}</p>
        </div>
      )}
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
  <div class="working-hours-section container">
  <h2 class="text-center mb-4">Графік роботи</h2>
  <div class="row text-center">
    <div class="col-md-4 mb-3">
      <h3 class="mb-3">Ветеринарний центр</h3>
      <p>Понеділок - П'ятниця: 08:00 - 20:00</p>
      <p>Субота: 09:00 - 18:00</p>
      <p>Неділя: Вихідний</p>
    </div>
    <div class="col-md-4 mb-3">
      <h3 class="mb-3">Кінологічний центр</h3>
      <p>Понеділок - П'ятниця: 09:00 - 19:00</p>
      <p>Субота: 10:00 - 17:00</p>
      <p>Неділя: Вихідний</p>
    </div>
    <div class="col-md-4 mb-3">
      <h3 class="mb-3">Центр грумінгу</h3>
      <p>Понеділок - П'ятниця: 10:00 - 20:00</p>
      <p>Субота: 10:00 - 18:00</p>
      <p>Неділя: 10:00 - 14:00</p>
    </div>
  </div>
</div>
</section>
    );
};
export default about;