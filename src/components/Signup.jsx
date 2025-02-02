/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [city, setCity] = useState('');
  const [location, setLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleCityChange = async (e) => {
    const input = e.target.value;
    setCity(input);

    if (input.length > 1) { // Lorsque l'utilisateur saisit plus de 1 caractère
      const apiKey = 'b399e41caa67f6b206289cb4633f94af'; // Remplace par ta propre clé API PositionStack

      try {
        const response = await axios.get(`http://api.positionstack.com/v1/forward`, {
          params: {
            access_key: apiKey,
            query: input,
          },
        });

        if (response.data.data) {
          setSuggestions(response.data.data); // Mettre à jour les suggestions
        } else {
          setSuggestions([]); // Aucune ville trouvée
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]); // Si l'utilisateur supprime le texte
    }
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.label); // Lorsque l'utilisateur sélectionne une ville
    setSuggestions([]); // Cacher les suggestions
    setLocation({
      lat: selectedCity.latitude,
      lon: selectedCity.longitude,
    });

    // Ajouter le console log ici pour afficher toutes les informations de la ville sélectionnée
    console.log('City Selected:', selectedCity);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-8 md:px-16">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Inscription</h1>
        <form method="post" action="http://localhost:3002/api/fetchSignup">
          <div className="mb-4">
            <input
              type="text"
              name="login"
              placeholder="Nom d'utilisateur"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="mail"
              placeholder="Adresse mail"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Numéro de téléphone"
              required
              pattern="\d{3}[-]\d{3}[-]\d{4}"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              name="city"
              placeholder="Entrez votre ville"
              value={city}
              onChange={handleCityChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleCitySelect(suggestion)}
                    className="p-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {suggestion.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
