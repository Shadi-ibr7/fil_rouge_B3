import { useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from "../ThemeContext"; // Import du ThemeContext

const CreateEventForm = ({ getToken, fetchEvents }) => {
  const { isDarkMode } = useContext(ThemeContext); // Utilisation du ThemeContext

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dateCreated: Date.now(),
    dateEvent: "",
    location: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Récupération du token avec getToken()
  const authToken = getToken ? getToken() : null;

  if (!authToken) {
    setError("Authentification requise.");
    return null;
  }

  const decodedToken = jwtDecode(authToken);
  const MailUser = decodedToken.email;
  const userId = decodedToken.userId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true); // Start loading

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("dateCreated", formData.dateCreated);
    form.append("dateEvent", formData.dateEvent);
    form.append("location", formData.location);
    form.append("createdBy", MailUser);
    form.append("userId", userId);

    if (formData.image) {
      form.append("image", formData.image);
    } else {
      setError("Veuillez télécharger une image.");
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await axios.post(
        "https://projet-b3.onrender.com/api/createEvent",
        form,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}` // Ajout du token dans l'en-tête
          }
        }
      );

      setMessage(response.data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        dateCreated: Date.now(),
        dateEvent: "",
        location: "",
        image: null,
      });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false); // Stop loading after the request
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-2xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-lg rounded-lg`}>
        <h2 className="text-2xl font-bold mb-4">Créer un Événement</h2>
        {loading && <div className="loading-cube"></div>} {/* Show loading animation */}
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="culturel">Culturel</option>
            <option value="sportif">Sportif</option>
            <option value="musique">Musique</option>
            <option value="théâtre">Théâtre</option>
            <option value="technologie">Technologie</option>
            <option value="gastronomie">Gastronomie</option>
          </select>
          <input
            type="date"
            name="dateEvent"
            value={formData.dateEvent}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]} // Définit la date minimale comme aujourd'hui
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
          />

          <input
            type="text"
            name="location"
            placeholder="Lieu"
            value={formData.location}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-lg hover:opacity-80 transition duration-300 ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}
          >
            Créer l'événement
          </button>
        </form>
      </div>
      <style jsx>{`
        .loading-cube {
          width: 50px;
          height: 50px;
          margin: 20px auto;
          background: blue;
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CreateEventForm;
