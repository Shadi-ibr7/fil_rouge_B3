import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { useTheme } from '../ThemeContext'; // Ajustez le chemin selon votre structure de dossiers

function Header({ isLoggedIn, setIsLoggedIn, allEvents }) {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Utiliser le contexte
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [setIsLoggedIn]);

  const eventsArray = Array.isArray(allEvents) ? allEvents : [];
  const filteredEvents = eventsArray.filter((event) =>
    event && event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
    setIsLoggedIn(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    navigate("/results", { state: { filteredEvents } });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`w-full px-4 py-4 overflow-x-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-12">
          <Link to="/" className="blockNav1">
            <h2 className="font-bold text-2xl sm:text-3xl">Event Ease</h2>
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex w-full max-w-[400px] space-x-2">
            <input
              type="text"
              className={`flex-grow min-w-0 border rounded-l-lg px-3 py-2 text-sm sm:text-base ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className={`whitespace-nowrap rounded-r-lg px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors duration-300 flex-shrink-0 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-800 text-white hover:bg-blue-600'}`}
            >
              Rechercher
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-xl">
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn && (
              <Link to="/userDetails" className="bg-blue-500 text-white rounded-lg px-4 py-2">
                Page utilisateur
              </Link>
            )}
            <Link to="/AllEvent" className="bg-gray-800 text-white rounded-lg px-4 py-2">
              Les événements
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600">
                Déconnexion
              </button>
            ) : (
              <>
                <Link to="/login" className="bg-gray-800 text-white rounded-lg px-4 py-2">
                  Connexion
                </Link>
                <Link to="/inscription" className="bg-gray-800 text-white rounded-lg px-4 py-2">
                  Inscription
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden text-3xl" onClick={toggleMenu}>
            <IoIosMenu />
          </button>
        </div>
      </div>

      <div className={`fixed top-0 right-0 w-48 h-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-2xl rounded-l-xl transform transition-transform duration-300 z-50 lg:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={toggleMenu} className="absolute top-2 right-2 text-2xl focus:outline-none">
          <IoIosClose className="hover:text-gray-300" />
        </button>
        <div className="mt-12 flex flex-col items-center space-y-4 px-2">
          {isLoggedIn && (
            <Link to="/userDetails" onClick={toggleMenu} className="w-full text-center bg-white text-black font-semibold rounded-full px-2 py-1 shadow hover:bg-gray-200 transition text-sm">
              Page utilisateur
            </Link>
          )}
          <Link to="/" onClick={toggleMenu} className="w-full text-center bg-white text-blue-500 font-semibold rounded-full px-2 py-1 shadow hover:bg-gray-200 transition text-sm">
            Accueil
          </Link>
          <Link to="/AllEvent" onClick={toggleMenu} className="w-full text-center bg-white text-blue-500 font-semibold rounded-full px-2 py-1 shadow hover:bg-gray-200 transition text-sm">
            Les événements
          </Link>
          {isLoggedIn ? (
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="w-full text-center bg-red-600 text-white font-semibold rounded-full px-2 py-1 shadow hover:bg-red-700 transition text-sm">
              Déconnexion
            </button>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu} className="w-full text-center bg-white text-blue-500 font-semibold rounded-full px-2 py-1 shadow hover:bg-gray-200 transition text-sm">
                Connexion
              </Link>
              <Link to="/inscription" onClick={toggleMenu} className="w-full text-center bg-white text-blue-500 font-semibold rounded-full px-2 py-1 shadow hover:bg-gray-200 transition text-sm">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
