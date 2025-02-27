/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from '../ThemeContext';
import backgroundImage from "../assets/image.webp";
import { ThemeContext } from "../ThemeContext";

function Home({ allEvents, isLoggedIn, setIsLoggedIn, getToken, fetchEvents }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [userEvents, setUserEvents] = useState([]);
  const [popup, setPopup] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [testimonials] = useState([
    {
      name: "Sophie Martin",
      role: "Organisatrice d'événements",
      text: "Cette plateforme a révolutionné ma façon d'organiser des événements. L'interface est intuitive et les fonctionnalités sont exactement ce dont j'avais besoin.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Thomas Dubois",
      role: "Participant régulier",
      text: "Je trouve tous les événements qui m'intéressent facilement. Le processus d'inscription est simple et rapide. Je recommande vivement !",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Émilie Rousseau",
      role: "Responsable marketing",
      text: "Nous utilisons cette plateforme pour tous nos événements d'entreprise. La gestion des participants est devenue un jeu d'enfant.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ]);

  const authToken = getToken("auth_token");


  // ======================== FETCH USER EVENTS ========================//
  const fetchUserEvents = async () => {
    if (authToken) {
      try {
       const response = await axios.get("https://projet-b3.onrender.com/api/user-events"
      //  const response = await axios.get("http://localhost:3002/api/user-events"
        , {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserEvents(response.data.events);
        } else {
          console.log(`Erreur lors de la récupération des événements : ${response.statusText}`);
        }
      } catch (err) {
        console.error("Erreur de récupération des événements utilisateur :", err);
      }
    } else {
      setUserEvents([]);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const handleStorageChange = () => {
      setIsLoggedIn(!!userId);
      fetchUserEvents();
    };

    fetchUserEvents();
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ======================== FORMAT DATE ========================
  const formatDate = (isoDate) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    };
    return new Date(isoDate).toLocaleDateString("fr-FR", options);
  };

  // ======================== POPUP ACTIONS ========================
  const handlePopup = (event, type) => {
    setPopup({ event, type });
  };

  const closePopup = () => {
    setPopup(null);
  };

  const confirmAction = async () => {
    if (!popup) return;
    const { event, type } = popup;

    if (!authToken) {
      console.log("Utilisateur non identifié. Veuillez vous connecter.");
      closePopup();
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.userId;
    } catch {
      console.log("Token utilisateur invalide. Veuillez vous reconnecter.");
      closePopup();
      return;
    }

    setActionLoading(true);
    try {
      const url =
        type === "participate"
          ? `https://projet-b3.onrender.com/api/participate/${userId}/${event._id}`
          : `https://projet-b3.onrender.com/api/withdraw/${userId}/${event._id}`;
      await axios.post(url);

      // Rafraîchit les événements
      await fetchUserEvents();
      await fetchEvents();
    } catch (err) {
      console.error("Erreur lors de l'action :", err);
    } finally {
      setActionLoading(false);
      closePopup();
    }
  };

  // ======================== SLIDER SETTINGS ========================
  const settings = {
    infinite: allEvents.length > 3,
    speed: 1000,
    slidesToShow: allEvents.length < 4 ? allEvents.length : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 740, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <div className={isDarkMode 
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen overflow-x-hidden text-gray-100' 
      : 'bg-gradient-to-b from-blue-50 to-white min-h-screen overflow-x-hidden text-gray-800'
    }>
      {/* ======================== POPUP ======================== */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-xl shadow-2xl max-w-sm w-full border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
            <img
              src={popup.event.image}
              alt=""
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
            <h3 className="text-xl font-bold mt-4">
              {popup.type === "participate"
                ? "Confirmer la participation"
                : "Confirmer le désistement"}
            </h3>
            <p className="mt-4 opacity-90">
              {popup.type === "participate"
                ? `Êtes-vous sûr de vouloir participer à l'événement "${popup.event.title}" ?`
                : `Êtes-vous sûr de vouloir vous désinscrire de l'événement "${popup.event.title}" ?`}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={closePopup}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionLoading 
                    ? "bg-gray-500" 
                    : popup.type === "participate"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                } transition-colors duration-200 shadow-md`}
                disabled={actionLoading}
              >
                {actionLoading ? "Chargement..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== SECTION HERO ======================== */}
      <main
        className="w-[92vw] mx-auto rounded-2xl relative overflow-hidden bg-cover bg-center mt-6 shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
          minHeight: 'min(92vw, 450px)',
        }}
      >
        <div className="flex flex-col justify-between h-full px-4 sm:px-8 md:px-14 py-8 sm:py-10">
          {/* Section titre avec espacement adaptatif */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-lg">
              Bienvenue sur notre site de billetterie !
            </h1>
            
            <div className="space-y-1 sm:space-y-2">
              <p className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                Où vos rêves <span className="text-blue-400 animate-pulse">Événementiel</span>
              </p>
              <p className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                prennent vie !
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 mb-14">
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-white drop-shadow-lg max-w-[95%] sm:max-w-[80%] md:max-w-[70%]">
              Non seulement vous pouvez acheter des billets pour les événements les plus populaires, mais vous pouvez
              également créer vos propres billets personnalisés grâce à notre plateforme facile à utiliser.
            </p>
          </div>
        </div>
        <Link
          to="/AllEvent"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-xl text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium whitespace-nowrap hover:scale-105"
        >
          Voir les événements
        </Link>
      </main>

      {/* ======================== SECTION STATISTIQUES ======================== */}
      <section className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl shadow-lg text-center ${
            isDarkMode 
              ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border border-gray-700' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
          } transform transition-all duration-300 hover:scale-105`}>
            <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">500+</div>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Événements organisés</p>
          </div>
          
          <div className={`p-6 rounded-xl shadow-lg text-center ${
            isDarkMode 
              ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border border-gray-700' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
          } transform transition-all duration-300 hover:scale-105`}>
            <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">10 000+</div>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Participants satisfaits</p>
          </div>
          
          <div className={`p-6 rounded-xl shadow-lg text-center ${
            isDarkMode 
              ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border border-gray-700' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
          } transform transition-all duration-300 hover:scale-105`}>
            <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">98%</div>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Taux de satisfaction</p>
          </div>
        </div>
      </section>

      {/* ======================== SECTION POURQUOI CHOISIR ? ======================== */}
      <section className="container mx-auto px-4 mt-20 max-w-6xl">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Pourquoi choisir notre plateforme ?
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-12 rounded-full"></div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700' 
              : 'bg-white border border-gray-100'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mb-3">Création simplifiée</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Créez et gérez vos événements en quelques clics grâce à notre interface intuitive.
            </p>
          </div>

          <div className={`p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700' 
              : 'bg-white border border-gray-100'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-3">Billetterie personnalisée</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Offrez à vos participants une expérience unique en personnalisant vos billets.
            </p>
          </div>

          <div className={`p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700' 
              : 'bg-white border border-gray-100'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">Notifications automatiques</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Recevez des rappels et tenez vos participants informés de toutes les mises à jour.
            </p>
          </div>
        </div>
      </section>

      {/* ======================== SECTION FONCTIONNALITÉS ======================== */}
      <section className="container mx-auto px-4 mt-20 max-w-6xl">
        <div className={`rounded-2xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-8 ${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Fonctionnalités principales</h2>
            <p className="opacity-90">Tout ce dont vous avez besoin pour gérer vos événements</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg flex items-start space-x-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-blue-50'} transition-colors duration-300`}>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gestion du calendrier</h3>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Planifiez vos événements avec précision et évitez les conflits d'horaires.</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg flex items-start space-x-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-blue-50'} transition-colors duration-300`}>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gestion des participants</h3>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Restez informé en suivant attentivement les inscriptions et en découvrant le nombre total de participants inscrits.</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg flex items-start space-x-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-blue-50'} transition-colors duration-300`}>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Personnalisation complète</h3>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Adaptez chaque aspect de vos événements selon vos besoins spécifiques.</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg flex items-start space-x-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-blue-50'} transition-colors duration-300`}>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Connectez-vous en un clin d'œil</h3>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Si vous n'avez pas de compte, connectez-vous facilement avec votre compte Google grâce à notre fonctionnalité intégrée.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SECTION LES ÉVÉNEMENTS ======================== */}
      <section className="container mx-auto px-4 mt-20 max-w-6xl">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Les événements à venir
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-12 rounded-full"></div>
        <div className="relative">
          {!allEvents.length ? (
            <p className={`text-center text-lg ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Aucun événement disponible.</p>
          ) : allEvents.length > 0 ? (
            <Slider
              {...{
                ...settings,
                slidesToShow: allEvents.length <= 4 ? allEvents.length : 4,
                infinite: allEvents.length > 4,
              }}
            >
              {allEvents.map((event) => {
                const isParticipating = userEvents.some(
                  (userEvent) => userEvent._id === event._id
                );
                return (
                  <div
                    key={event._id}
                    className="p-4 w-full sm:w-[300px] h-[400px] flex flex-col items-center transition-transform duration-300"
                  >
                    <div className={`w-full h-full rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} p-4 transition-transform duration-300 hover:scale-105`}>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <h3 className={`text-xl font-bold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{event.title}</h3>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{formatDate(event.dateEvent)}</p>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Participants: <span className="font-semibold">{event.participants.length}</span>
                      </p>
                      <div className="mt-4">
                        {isLoggedIn && (
                          <button
                            className={`w-full px-4 py-2 rounded-lg text-white ${
                              isParticipating
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            } transition-colors duration-200 shadow-md`}
                            onClick={() =>
                              handlePopup(event, isParticipating ? "withdraw" : "participate")
                            }
                          >
                            {isParticipating ? "Se désinscrire" : "Participer"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-around">
              {allEvents.map((event) => {
                const isParticipating = userEvents.some(
                  (userEvent) => userEvent._id === event._id
                );
                return (
                  <div
                    key={event._id}
                    className={`p-4 w-full sm:w-[300px] h-[400px] flex flex-col items-center shadow-lg border rounded-lg transition-transform duration-300 transform hover:scale-105 mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className={`text-xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {event.title}
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(event.dateEvent)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ======================== SECTION TÉMOIGNAGES ======================== */}
      <section className="container mx-auto px-4 mt-20 max-w-4xl">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Ce que disent nos utilisateurs
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-12 rounded-full"></div>
        
        <div className={`rounded-xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <Slider {...testimonialSettings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4 py-6">
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  />
                  <div className="mt-4">
                    <p className={`text-lg italic mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      "{testimonial.text}"
                    </p>
                    <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{testimonial.name}</h3>
                    <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ======================== SECTION APPEL À L'ACTION ======================== */}
      <section className="container mx-auto px-4 mt-20 max-w-6xl">
        <div className={`rounded-2xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Prêt à créer votre événement ?
              </h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Rejoignez des milliers d'organisateurs qui font confiance à notre plateforme pour leurs événements. 
                Commencez dès aujourd'hui et découvrez la différence !
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/addEvent"
                  className={`px-6 py-3 rounded-lg text-white font-medium text-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                  } transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  Créer un événement
                </Link>
                <Link
                  to="/AllEvent"
                  className={`px-6 py-3 rounded-lg font-medium text-center ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  Explorer les événements
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Inscription gratuite</p>
                  </div>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Création d'événements illimitée</p>
                  </div>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Connexion instantanée</p>
                  </div>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Filtrages des événements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SECTION FAQ ======================== */}
      <section className="container mx-auto px-4 mt-20 max-w-4xl">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Questions fréquentes
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-12 rounded-full"></div>
        
        <div className={`rounded-xl overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comment créer un événement ?
            </h3>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Pour créer un événement, connectez-vous à votre compte, cliquez sur "Créer un événement" et suivez les instructions. Vous pourrez ajouter tous les détails nécessaires comme le titre, la date, le lieu et une description.
            </p>
          </div>
          
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comment s'inscrire à un événement ?
            </h3>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Parcourez les événements disponibles, sélectionnez celui qui vous intéresse et cliquez sur "Participer". Vous recevrez une confirmation par email avec tous les détails.
            </p>
          </div>
          
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Est-ce que je peux modifier mon événement après sa création ?
            </h3>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Oui, vous pouvez modifier les détails de votre événement à tout moment. Accédez à votre tableau de bord, trouvez l'événement concerné et cliquez sur "Modifier".
            </p>
          </div>
          
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comment annuler ma participation à un événement ?
            </h3>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Vous pouvez annuler votre participation en accédant à votre profil, en sélectionnant l'événement et en cliquant sur "Se désinscrire". L'organisateur sera automatiquement informé.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;