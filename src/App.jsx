import React from 'react';
import './App.css';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './components/Register';
import Home from './components/Home';
import Services from './components/Services';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Pet from './pages/Pet';
import History from './pages/History';
import Achievements from './pages/Achievements';
import Album from './pages/Album';
import Veterinary from './pages/veterinary';
import "swiper/css";
import "swiper/css/pagination";
import Cynology from './pages/cynology'; 
import Grooming from './pages/Grooming';
import About from "./components/About";
import FindMatch from './pages/FindMatch';

function App() {
  return (
    <Router>
      <Routes>
        {/* Головна сторінка з Header */}
        <Route path="/" element={<LayoutWithHeader />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="veterinary" element={<Veterinary />} />
          <Route path="cynology" element={<Cynology />} />
          <Route path="grooming" element={<Grooming />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="about" element={<About />} />
          <Route path="find-match" element={<FindMatch />} />



          {/* Шлях до профілю та його вкладок */}
          <Route path="profile" element={<Profile />}>
            <Route path="pet" element={<Pet />} />
            <Route path="history" element={<History />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="album" element={<Album />} />
          </Route>
        </Route>

        {/* Сторінки входу та реєстрації */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

function LayoutWithHeader() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;