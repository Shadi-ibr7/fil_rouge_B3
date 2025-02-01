/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../style/calendar.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function EventsPage({ allEvents }) {
  const [error, setError] = useState("");
  const [view, setView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [eventData, setEventData] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const categories = ["Tous", "culturel", "sportif", "communautaire"];

  useEffect(() => {
    if (eventData) {
      console.log("Updated eventData:", eventData);
    }
  }, [eventData]);

  const getCookie = name => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  const fetchUserEvents = async () => {
    const authToken = getCookie("auth_token");
    if (authToken) {
      try {
        const response = await axios.get("http://localhost:3002/api/user-events", {
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
    setSelectedDate(dailyEvents.length > 0 ? dailyEvents : []);
    setOpenModal(true);
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
    const authToken = getCookie("auth_token");
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
        ? `http://localhost:3002/api/participate/${userId}/${event._id}`
        : `http://localhost:3002/api/withdraw/${userId}/${event._id}`;
        
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

  return (
    <div className="events-page">
      <div className="view-toggle">
        <button
          className={`view-button ${view === "calendar" ? "active" : ""}`}
          onClick={() => setView("calendar")}
        >
          Vue Calendrier
        </button>
        <button
          className={`view-button ${view === "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          Vue Liste
        </button>
      </div>

      <div className="category-filter text-center">
        <div className="mb-6 inline-block">
          <select
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {view === "calendar" && (
        <div className="calendar-container">
          <Calendar
            onClickDay={(date) => {
              const eventsForDate = filterEventsByDate(date);
              if (eventsForDate.length > 0) {
                setSelectedDate(date);
                setEventData(eventsForDate);
                setOpenModal(true);
              } else {
                alert("Aucun événement pour cette date.");
              }
            }}
            minDate={null}
            tileClassName={({ date, view }) => {
              if (view === "month" && hasEventsOnDay(date)) {
                return "react-calendar__tile--has-event";
              }
              return null;
            }}
          />
        </div>
      )}

      {view === "list" && (
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
            Liste des Événements
          </h1>
          {filteredEvents.length === 0 ? (
            <p className="text-center text-lg text-gray-500">
              Aucun événement trouvé pour cette catégorie.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredEvents.map((event) => {
                const isParticipating = userEvents.some(userEvent => userEvent._id === event._id);
                return (
                  <div
                    onClick={() => handlePopup(event)}
                    key={event._id}
                    className="bg-white rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
                  >
                    <div className="h-56 bg-gray-200 rounded-t-lg relative">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-56 w-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-semibold">
                          Pas d'image disponible
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-3 hover:text-indigo-600 transition-colors duration-200">
                        {event.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <p className="text-gray-500 text-sm mb-1">
                        <strong>Catégorie :</strong> {event.category}
                      </p>
                      <p className="text-gray-500 text-sm mb-3">
                        <strong>Date de l'événement :</strong>{" "}
                        {new Date(event.dateEvent).toLocaleString()}
                      </p>

                      {getCookie("auth_token") && (
  isParticipating ? (
    <button
      onClick={() => handleParticipation(event, "withdraw")}
      className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white"
    >
      Se désinscrire
    </button>
  ) : (
    <button
      onClick={() => handleParticipation(event, "participate")}
      className="mt-4 px-4 py-2 rounded-lg bg-green-500 text-white"
    >
      Participer
    </button>
  )
)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {openModal && eventData && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg animate-fadeIn">
            <div className="modal-header mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {eventData.title}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition"
                onClick={closePopup}
              >
                ✕
              </button>
            </div>
            <div className="modal-body space-y-4">
              <img
                src={eventData.image}
                alt={`Image de ${eventData.title}`}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
              <p><strong>Titre:  </strong>{eventData.description}</p>
              <p><strong>Catégorie:</strong> {eventData.category}</p>
              <p><strong>Lieu:</strong> {eventData.location}</p>
              <p><strong>Créé par:</strong> {eventData.createdBy}</p>

              {getCookie("auth_token") && (
  <div className="flex justify-center mt-4">
    {actionLoading ? (
      <p>Chargement...</p>
    ) : (
      <>
        {userEvents.some((userEvent) => userEvent._id === eventData._id) ? (
          <button
            onClick={() => handleParticipation(eventData, "withdraw")}
            className="px-4 py-2 rounded-lg bg-red-500 text-white"
          >
            Se désinscrire
          </button>
        ) : (
          <button
            onClick={() => handleParticipation(eventData, "participate")}
            className="px-4 py-2 rounded-lg bg-green-500 text-white"
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
        </div>
      )}
    </div>
  );
}

export default EventsPage;
