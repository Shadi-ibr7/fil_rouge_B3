/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Home({ allEvents }) {
  const getAuthTokenFromCookies = () => {
    const cookie = document.cookie.split("; ").find(row => row.startsWith("auth_token="));
    return cookie ? cookie.split("=")[1] : null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthTokenFromCookies());
  const [userEvents, setUserEvents] = useState([]);
  const [popup, setPopup] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  
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
          if (response.data.events.length === 0) {
            console.log("Vous participez à aucun événement.");
          }
        } else {
          console.log(`Erreur lors de la récupération des événements : ${response.statusText}`);
        }
      } catch (err) {
        console.error("Erreur de récupération des événements utilisateur :", err);
      }
    } else {
      setUserEvents([]);
      console.log("Pas de token trouvé");
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const userId = localStorage.getItem("userId");
      setIsLoggedIn(!!userId);
      fetchUserEvents();
    };

    fetchUserEvents();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const formatDate = isoDate => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" };
    return new Date(isoDate).toLocaleDateString("fr-FR", options);
  };

  const handlePopup = (event, type) => {
    setPopup({ event, type });
  };

  const closePopup = () => {
    setPopup(null);
  };

  const confirmAction = async () => {
    if (!popup) return;

    const { event, type } = popup;
    const authToken = getCookie("auth_token");
    if (!authToken) {
      console.log("Utilisateur non identifié. Veuillez vous connecter.");
      closePopup();
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.userId;
    } catch{
      console.log("Token utilisateur invalide. Veuillez vous reconnecter.");
      closePopup();
      return;
    }

    setActionLoading(true);
    try {
      const url =
        type === "participate"
          ? `http://localhost:3002/api/participate/${userId}/${event._id}`
          : `http://localhost:3002/api/withdraw/${userId}/${event._id}`;

      const response = await axios.post(url);
      console.log(response.data.message);
      await fetchUserEvents();
    } catch (err) {
      console.error("Erreur lors de l'action :", err);
      console.log("Une erreur est survenue lors de l'action.");
    } finally {
      setActionLoading(false);
      closePopup();
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 740, settings: { slidesToShow: 2 } },
    ],
  };


  
  return (
    <div>
         {popup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
      <img src= {popup.image} alt="" />
      <h3 className="text-lg font-bold">
        {popup.type === "participate"
          ? "Confirmer la participation"
          : "Confirmer le désistement"}
      </h3>
      <p className="mt-4">
        {popup.type === "participate"
          ? `Êtes-vous sûr de vouloir participer à l'événement "${popup.event.title}" ?`
          : `Êtes-vous sûr de vouloir vous désinscrire de l'événement "${popup.event.title}" ?`}
      </p>
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={closePopup}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          onClick={confirmAction}
          className={`px-4 py-2 rounded-lg text-white ${
            actionLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={actionLoading}
        >
          {actionLoading ? "Chargement..." : "Confirmer"}
        </button>
      </div>
    </div>
  </div>
)}

            <main
        className="w-[92vw] mx-auto mt-[18px] rounded-2xl py-14 bg-gray-800  relative bg-cover bg-center bg-no-repeat"
      >
        <div className="grid grid-cols-1 grid-rows-3 items-center mt-[18px] h-full px-14 text-white">
          <div>
            <h1>Bienvenue sur notre site de billetterie !</h1>
          </div>
          <div>
            <p className="text-4xl font-bold">
              Où vos rêves <span>Événementiel</span> <br /> prennent vie !
            </p>
          </div>
          <div className="pb-14">
            <p>
              Non seulement vous pouvez acheter des billets pour les événements les plus populaires, mais vous pouvez
              également créer vos propres billets personnalisés grâce à notre plateforme facile à utiliser.
            </p>
          </div>
        </div>
        <button className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-black text-white p-4 rounded-lg hover:bg-blue-600 shadow-lg">
  Explorer les événements
</button>

      </main>


      <section className="w-[92vw] mx-auto mt-28">
        <h2 className="text-4xl font-bold text-center text-gray-800">Les événements</h2>

        <div className="mt-12 mx-auto">
          {!allEvents.length ? (
            <p className="text-center">Aucun événement disponible.</p>
          ) : (
            <Slider {...settings}>
              {allEvents.map(event => {
                const isParticipating = userEvents.some(userEvent => userEvent._id === event._id);

                return (
                  <div key={event._id} className="blockEvent h-90 w-[90%] max-w-xs border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-xl transition duration-300 mx-auto p-4">
                    <img
                      src={event.image || "default-event.jpeg"}
                      alt={event.title}
                      className="h-56 w-full object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-gray-800">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      <p className="text-sm text-gray-600 mt-2">Date : {formatDate(event.dateEvent)}</p>
                      {isLoggedIn &&
                        (isParticipating ? (
                          <button
                            onClick={() => handlePopup(event, "withdraw")}
                            className="mt-4 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                          >
                            Se désinscrire
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePopup(event, "participate")}
                            className="mt-4 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                          >
                            Participer
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;








