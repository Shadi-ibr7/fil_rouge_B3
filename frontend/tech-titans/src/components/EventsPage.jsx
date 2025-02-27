/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useContext } from "react";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../style/calendar.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

function EventsPage({ allEvents, fetchEvents, getToken }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [error, setError] = useState("");
  const [view, setView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [eventData, setEventData] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const categories = [
    "Tous",
    "culturel",
    "sportif",
    "communautaire",
    "musique",
    "théâtre",
    "conférence",
    "festival",
    "art",
    "bien-être",
    "éducation",
    "technologie",
    "gastronomie",
    "environnement",
    "mode",
    "entrepreneuriat",
    "littérature",
    "caritatif",
    "cinéma",
    "famille",
    "voyage"
  ];


  const fetchUserEvents = async () => {
    const authToken = getToken("auth_token");
    if (authToken) {
      try {
       const response = await axios.get("https://projet-b3.onrender.com/api/user-events"
        , {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserEvents(response.data.events);
        }
      } catch (err) {
        console.error("Erreur de récupération des événements utilisateur :", err);
      }
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const filterEvents = () => {
    if (selectedCategory === "Tous") {
      return allEvents;
    }
    return allEvents.filter((event) => event.category === selectedCategory);
  };

  const filteredEvents = filterEvents();

  const filterEventsByDate = (date) => {
    const selectedDate = format(date, "yyyy-MM-dd");
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.dateEvent);
      return (
        !isNaN(eventDate) &&
        format(eventDate, "yyyy-MM-dd") === selectedDate
      );
    });
  };

  const openEventPopup = (date) => {
    const dailyEvents = filterEventsByDate(date);
    if (dailyEvents.length > 0) {
      setSelectedDate(date);  // Optionnel, si tu veux conserver la date dans l'état
      setEventData(dailyEvents[0]);  // Afficher le premier événement du jour ou l'un d'entre eux
      console.log(dailyEvents)
      setOpenModal(true);
      
    } else {
      alert("Aucun événement pour cette date.");
    }
  };
  
  const handlePopup = (event) => {
    setEventData(event);
    setOpenModal(true);
  };

  const closePopup = () => {
    setOpenModal(false);
    setEventData(null);
  };

  const hasEventsOnDay = (day) => {
    return filteredEvents.some((event) => {
      const eventDate = new Date(event.dateEvent);
      return format(eventDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    });
  };

  const handleParticipation = async (event, actionType) => {
    const authToken = getToken("auth_token");
    if (!authToken) {
      console.log("Utilisateur non connecté.");
      closePopup();
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Erreur de décodage du token", error);
      closePopup();
      return;
    }

    setActionLoading(true);
    const url =
      actionType === "participate"
        ? `https://projet-b3.onrender.com/api/participate/${userId}/${event._id}`
        : `https://projet-b3.onrender.com/api/withdraw/${userId}/${event._id}`;
        
    try {
      const response = await axios.post(url, {}, { headers: { Authorization: `Bearer ${authToken}` } });
      console.log(response.data.message);
      fetchUserEvents();
    } catch (error) {
      console.error("Erreur lors de l'action", error);
      closePopup();
    } finally {
      setActionLoading(false);
    }
  };

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

  return (
    <div className={isDarkMode 
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen overflow-x-hidden text-gray-100 p-4 sm:p-6' 
      : 'bg-gradient-to-b from-blue-50 to-white min-h-screen overflow-x-hidden text-gray-800 p-4 sm:p-6'
    }>
      <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Événements
      </h1>
      
      <div className="flex justify-center mb-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-md">
          <button
            className={`px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 flex-1 ${
              view === "calendar" 
                ? `${isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'} shadow-lg transform hover:scale-105` 
                : `${isDarkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'} hover:bg-opacity-90`
            }`}
            onClick={() => setView("calendar")}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Vue Calendrier
            </span>
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 flex-1 ${
              view === "list" 
                ? `${isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'} shadow-lg transform hover:scale-105` 
                : `${isDarkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'} hover:bg-opacity-90`
            }`}
            onClick={() => setView("list")}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Vue Liste
            </span>
          </button>
        </div>
      </div>

      <div className="category-filter text-center mb-8">
        <div className="inline-block relative">
          <select
            className={`appearance-none px-5 py-3 pr-10 rounded-full shadow-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {view === "calendar" && (
        <div className={`calendar-container mx-auto max-w-3xl p-4 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <Calendar
            onClickDay={(date) => {
              openEventPopup(date);
            }}
            minDate={null}
            tileClassName={({ date, view }) => {
              if (view === "month" && hasEventsOnDay(date)) {
                return `react-calendar__tile--has-event ${isDarkMode ? 'dark-event-tile' : ''}`;
              }
              return null;
            }}
            className={isDarkMode ? 'dark-calendar' : ''}
          />
        </div>
      )}

      {view === "list" && (
        <div className="min-h-screen">
          {filteredEvents.length === 0 ? (
            <div className={`text-center p-8 rounded-lg shadow-md ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucun événement trouvé pour cette catégorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => {
                const isParticipating = userEvents.some(userEvent => userEvent._id === event._id);
                return (
                  <div
                    key={event._id}
                    className={`rounded-xl overflow-hidden shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer ${
                      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                    onClick={() => handlePopup(event)}
                  >
                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-56 w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-semibold">
                          Pas d'image disponible
                        </div>
                      )}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className={`text-xl font-bold mb-2 line-clamp-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {event.title}
                      </h2>
                      
                      <p className={`text-sm mb-3 line-clamp-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {event.description}
                      </p>
                      
                      <div className={`flex items-center mb-3 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.dateEvent)}
                      </div>

                      {getToken("auth_token") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParticipation(event, isParticipating ? "withdraw" : "participate");
                          }}
                          className={`w-full mt-3 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
                            isParticipating
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          } shadow-md hover:shadow-lg transform hover:scale-105`}
                        >
                          {isParticipating ? "Se désinscrire" : "Participer"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal pour les détails de l'événement */}
      {openModal && eventData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className={`relative rounded-xl shadow-2xl p-6 w-11/12 max-w-lg animate-fadeIn ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <button
              className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } transition-colors duration-200`}
              onClick={closePopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{eventData.title}</h2>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
              }`}>
                {eventData.category}
              </div>
            </div>
            
            <div className="mb-6 rounded-lg overflow-hidden shadow-md">
              <img
                src={eventData.image}
                alt={`Image de ${eventData.title}`}
                className="w-full h-56 object-cover"
              />
            </div>
            
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p>{eventData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Lieu</h3>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {eventData.location}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-1">Date</h3>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(eventData.dateEvent)}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1">Créé par</h3>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {eventData.createdBy}
                </p>
              </div>
            </div>

            {getToken("auth_token") && (
              <div className="flex justify-center mt-8">
                {actionLoading ? (
                  <div className={`px-6 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </div>
                  </div>
                ) : (
                  <>
                    {userEvents.some((userEvent) => userEvent._id === eventData._id) ? (
                      <button
                        onClick={() => handleParticipation(eventData, "withdraw")}
                        className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        Se désinscrire
                      </button>
                    ) : (
                      <button
                        onClick={() => handleParticipation(eventData, "participate")}
                        className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        Participer
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;