import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoIosClose } from "react-icons/io";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]; 
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Récupérer les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:3002/api/fetch-events");
        setEvents(data.events || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  // Filtrer les événements selon la recherche
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Supprimer le cookie lors de la déconnexion
    document.cookie = 'auth_token=; Max-Age=0'; // Supprimer le cookie
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload(); // Recharger la page pour effectuer une déconnexion complète
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return;
    }
    navigate("/results", { state: { filteredEvents } });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-[99vw] mx-auto p-4 flex flex-wrap justify-between items-center">
      <Link to="/" className="blockNav1">
        <h2 className="font-bold text-3xl">Eventnity.</h2>
      </Link>

      <div className="flex justify-center w-full max-w-[600px] mb-4 lg:mb-0 lg:mr-8">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2"
            placeholder="Rechercher des événements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-800 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
          >
            Rechercher
          </button>
        </form>
      </div>

      <button className="lg:hidden text-3xl" onClick={toggleMenu}>
        <IoIosMenu />
      </button>

      <div className={`lg:flex ${isMenuOpen ? "block" : "hidden"} lg:block space-x-14 mt-4 lg:mt-0`}>
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {isLoggedIn && (
            <Link to="/userDetails" className="bg-blue-500 text-white rounded-lg px-4 py-2 ">
              Page utilisateur
            </Link>
          )}
          <Link to="/" className="bg-gray-800 text-white rounded-lg px-4 py-2 ">Accueil</Link>
          <Link to="/AllEvent" className="bg-gray-800 text-white rounded-lg px-4 py-2 ">Les événements</Link>
        </div>

        <div className="flex flex-col items-center space-y-4 lg:space-y-0 lg:flex-row lg:space-x-6 lg:ml-auto">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-gray-800 text-white rounded-lg px-4 py-2">Connexion</Link>
              <Link to="/inscription" className="bg-gray-800 text-white rounded-lg px-4 py-2">Inscription</Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 w-[250px] bg-white h-full shadow-lg transform transition-transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-3xl"
          onClick={toggleMenu}
        >
          <IoIosClose />
        </button>
        <div className="flex flex-col items-center mt-12 space-y-6">
          <Link to="/" className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Lien 1</Link>
          <Link to="/" className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Lien 2</Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
