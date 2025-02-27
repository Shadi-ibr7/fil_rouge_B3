import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GeneralAdminInterface = ({ fetchEvents, allEvents, setEvents, getAdminToken }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log(getAdminToken)

  const deleteEvent = async (eventId) => {
    const authToken = getAdminToken ? getAdminToken() : null;

    if (!authToken) {
      setError("Authentification requise.");
      return;
    }

    try {
      await axios.delete(`https://projet-b3.onrender.com/api/user/${eventId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setEvents(allEvents.filter(event => event._id !== eventId));
      fetchEvents();
      setSuccess('Événement supprimé avec succès.');
    } catch (err) {
      setError("Erreur lors de la suppression de l'événement.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setSuccess("Déconnexion réussie.");
    window.location.href = "/"; 
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-100 min-h-screen relative">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 text-white rounded-lg px-6 py-3 hover:bg-red-600 transition-colors duration-300"
      >
        Déconnexion
      </button>

      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Liste des Événements</h1>

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl shadow-lg">
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl shadow-lg">
          <span>{error}</span>
        </div>
      )}

      {allEvents.length === 0 ? (
        <p className="text-center text-lg text-gray-500">Aucun événement à afficher pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allEvents.map(event => (
            <div 
              key={event._id} 
              className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="h-56 bg-gray-200 rounded-t-lg relative">
                {event.image ? (
                  <img 
                    src={`${event.image}`} 
                    alt={event.title} 
                    className="h-full w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-semibold">
                    Pas d&apos;image disponible
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <p className="text-gray-500 text-sm mb-1"><strong>Catégorie :</strong> {event.category}</p>
                <p className="text-gray-500 text-sm mb-3"><strong>Date de l'événement :</strong> {new Date(event.dateEvent).toLocaleString()}</p>
                <p className="text-gray-500 text-sm mb-3"><strong>Lieu :</strong> {event.location}</p>
                <p className="text-gray-500 text-sm"><strong>Contact :</strong> {event.contactInfo?.email || 'Non spécifié'}</p>

                <button
                  onClick={() => deleteEvent(event._id)}
                  className="mt-4 bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-colors duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralAdminInterface;
