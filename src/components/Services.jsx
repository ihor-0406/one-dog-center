import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Services.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

function Services() {
    useEffect(() => {
        document.title = 'Послуги';
    }, []);
    // Використовуємо стан для зберігання індексу активного запитання
    const [activeIndex, setActiveIndex] = useState(null);

    // Масив з питаннями та відповідями для блоку FAQ
    const questionsAnswers = [
            {
              "question": "Які аналізи та обстеження необхідні перед хірургічним втручанням?",
              "answer": "Перед будь-якою хірургічною операцією наші ветеринари рекомендують проводити повний клінічний огляд, аналіз крові та, за необхідності, ультразвукове дослідження. Це дозволяє мінімізувати ризики та підготуватися до операції з урахуванням стану здоров’я улюбленця."
            },
            {
              "question": "Як підготувати собаку до вакцинації?",
              "answer": "Перед вакцинацією важливо переконатися, що улюбленець здоровий та пройшов профілактичну дегельмінтизацію за 7-10 днів до вакцинації. Також рекомендується уникати стресових ситуацій і дотримуватися режиму харчування за день до процедури."
            },
            {
              "question": "Як часто потрібно проходити профілактичний огляд у ветеринара?",
              "answer": "Для підтримання здоров’я собаки рекомендується проходити профілактичний огляд у ветеринара щонайменше раз на рік. Для літніх собак (старших 7 років) огляди рекомендується проводити двічі на рік."
            },
            {
              "question": "Що робити, якщо у моєї собаки проблеми з поведінкою?",
              "answer": "Наш кінологічний центр пропонує консультації з поведінки, а також спеціальні програми для корекції. Кваліфіковані спеціалісти допоможуть розробити індивідуальний план для вирішення конкретних проблем поведінки."
            },
            {
              "question": "Які послуги включає в себе процедура грумінгу?",
              "answer": "Наші послуги грумінгу включають стрижку, чистку вух, підрізання кігтів, догляд за шкірою та шерстю, а також перевірку на наявність шкірних захворювань. Усі процедури виконуються професіоналами, що забезпечує безпеку та комфорт улюбленця."
            },
            {
              "question": "Як записатися на прийом до ветеринара?",
              "answer": "Ви можете записатися на прийом, зателефонувавши за вказаним на сайті номером телефону або скориставшись формою онлайн-запису. Ми також пропонуємо можливість вибору зручного часу та лікаря, якщо це необхідно."
            },
            {
              "question": "Чи можна скасувати або перенести запис на прийом?",
              "answer": "Так, ви можете скасувати або перенести запис, зв’язавшись із нашим адміністратором телефоном не пізніше ніж за 24 години до призначеного часу. Це дозволить перенести запис на зручніший для вас час."
            },
            {
              "question": "Які програми навчання пропонує кінологічний центр?",
              "answer": "Наш кінологічний центр пропонує програми для цуценят та дорослих собак, включаючи навчання базовим командам, соціалізацію, а також спеціалізовані курси для корекції поведінки. Ми розробляємо індивідуальні програми, враховуючи потреби та характер вашої собаки."
            },
            {
              "question": "Скільки часу займає курс навчання в кінологічному центрі?",
              "answer": "Тривалість курсу навчання залежить від цілей та індивідуальних особливостей вашої собаки. Зазвичай курс складається з 10-15 занять, які проводяться 1-2 рази на тиждень для оптимального засвоєння матеріалу."
            },
            {
              "question": "Як часто потрібно приводити собаку на грумінг?",
              "answer": "Рекомендована частота грумінгу залежить від породи та типу шерсті вашої собаки. Зазвичай стрижка та основні процедури проводяться кожні 4-8 тижнів для підтримання шерсті в здоровому стані."
            },
            {
              "question": "Чи є спеціальні умови для грумінгу собак з чутливою шкірою?",
              "answer": "Так, ми використовуємо гіпоалергенні засоби та особливі техніки для догляду за собаками з чутливою шкірою. Професійні грумери підберуть індивідуальний підхід, щоб процедури були максимально комфортними для улюбленця."
            }

    ];

    // Функція для переключення активного запитання
    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="container">
           <nav aria-label="breadcrumb">
               <ol className="breadcrumb my-4">
                   <li className="breadcrumb-item"><Link to="/">Головна</Link></li>
                   <li className="breadcrumb-item active" aria-current="page">Послуги</li>
               </ol>
           </nav>
               <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
                   <div className="col">
                      <div className="card h-100 cardOne">
                      <h5 className="poppins-semi bold fw-medium text-start ms-2 mt-2 text-warning logoOD">
                            One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span>
                        </h5>
                               <div className="card-body text-center">
                               </div>
                               <div className="card-footer bg-info-subtle text-center">
                                  <Link to="/veterinary" className="fs-3 fw-bold text-black text-decoration-none">Ветеринарія</Link>
                               </div>
                               </div>
                      </div>
                <div className="col">
                     <div className="card h-100 cardTwo">
                     <h5 className="poppins-semibold mt-2 ms-2 fw-medium text-warning logoOD">
                            One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span>
                        </h5>
                     <div className="card-body text-center ">
                     
                    </div>
                    <div className="card-footer bg-info-subtle text-center">
                        <Link to="/cynology" className="fs-3 fw-bold text-black text-decoration-none ">Кінологічний центр</Link>
                   </div>
                   </div>
               </div>
        <div className="col">
              <div className="card h-100 cardThree">
              <h5 className="poppins-semibold fw-medium ms-2 mt-2 text-warning logoOD">
                            One<span className="fw-bolder">D<FontAwesomeIcon icon={faPaw} style={{ color: "#078550" }} />g</span>
                        </h5>
             <div className="card-body text-center my-5">
            </div>
             <div className="card-footer bg-info-subtle text-center">
                   <Link to="/grooming" className="fs-3 fw-bold text-black text-decoration-none">Грумінг</Link>
            </div>
         </div>
     </div>
</div>
           <div className="faq-container mt-5">
            <h2 className="faq-title">Часті запитання</h2>
            <div className="faq-list">
                {questionsAnswers.map((item, index) => (
                    <div key={index} className="faq-item">
                        <div 
                            className="faq-question"
                            onClick={() => toggleAnswer(index)}
                        >
                            {item.question}
                        </div>
                        {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
        </section>
    );
}

export default Services;