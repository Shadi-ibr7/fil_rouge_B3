/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import axios from 'axios';

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dateCreated: Date.now(),
    dateEvent: '',
    location: '',
    image: null,
    email: '',
    phone: '',
    createdBy: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationError, setLocationError] = useState(''); // Ajouter un état pour gérer l'erreur de localisation

  // Gère les changements de l'input de localisation
  const handleLocationChange = async (e) => {
    const input = e.target.value;
    setFormData({ ...formData, location: input });
    setLocationError(''); // Réinitialiser l'erreur lors de la saisie

    if (input.length > 1) { // Commence à chercher après 3 caractères
      const apiKey = 'b399e41caa67f6b206289cb4633f94af'; // Remplace par ta propre clé API PositionStack

      try {
        const response = await axios.get(`http://api.positionstack.com/v1/forward`, {
          params: {
            access_key: apiKey,
            query: input,
          },
        });

        if (response.data.data && response.data.data.length > 0) {
          setLocationSuggestions(response.data.data);
        } else {
          setLocationSuggestions([]);
          setLocationError('Ville introuvable. Essayez une autre localisation.'); // Afficher le message d'erreur
        }
      } catch (error) {
        console.error("Erreur lors de la recherche de la localisation", error);
        setLocationSuggestions([]);
        setLocationError('Ville introuvable. Essayez une autre localisation.'); // Afficher le message d'erreur
      }
    } else {
      setLocationSuggestions([]);
      setLocationError(''); // Réinitialiser l'erreur lorsque le champ est vide
    }
  };

  // Sélectionne une suggestion et ferme la liste
  const handleLocationSelect = (selectedLocation) => {
    setFormData({ ...formData, location: selectedLocation.label });
    setLocationSuggestions([]); // Vide les suggestions après sélection
    setLocationError(''); // Réinitialise l'erreur si une localisation est sélectionnée
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const contactInfo = {
      email: formData.email,
      phone: formData.phone,
    };

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("dateCreated", formData.dateCreated);
    form.append("dateEvent", formData.dateEvent);
    form.append("location", formData.location);
    form.append("contactInfo", JSON.stringify(contactInfo));
    form.append("createdBy", formData.createdBy);

    if (formData.image) {
      form.append("image", formData.image);
    } else {
      setError("Veuillez télécharger une image.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/api/createEvent', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      setFormData({
        title: '',
        description: '',
        category: '',
        dateCreated: Date.now(),
        dateEvent: '',
        location: '',
        image: null,
        email: '',
        phone: '',
        createdBy: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Créer un événement</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {locationError && <p className="text-red-500 mb-4">{locationError}</p>} {/* Afficher l'erreur si la ville est introuvable */}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Champ Titre */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Titre</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Champ Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Champ Catégorie */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Catégorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>Choisir une catégorie</option>
            <option value="culturel">Culturel</option>
            <option value="sportif">Sportif</option>
            <option value="communautaire">Communautaire</option>
          </select>
        </div>

        {/* Champ Date et Heure pour l'événement */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Date et Heure de l événement</label>
          <input
            type="datetime-local"
            name="dateEvent"
            value={formData.dateEvent}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={new Date().toISOString().slice(0, 16)} // Pour s'assurer que l'heure est valide et ne peut pas être dans le passé
            required
          />
        </div>

        {/* Champ Localisation */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium">Localisation</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleLocationChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {locationSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10">
              {locationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleLocationSelect(suggestion)}
                  className="p-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Champ Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/jpeg, image/jpg, image/png, image/gif"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Champs Informations de Contact */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email de contact</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="email@exemple.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Numéro de téléphone de contact</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="+33 6 12 34 56 78"
            required
          />
        </div>

        {/* Champ "Créer par" */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Créé par</label>
          <input
            type="text"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-indigo-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-600"
          >
            Créer l'événement
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
