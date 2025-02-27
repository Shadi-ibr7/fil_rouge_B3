import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const EditEvent = ({fetchEvents}) => {
  console.log(fetchEvents)
  const { eventId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [dateEvent, setDateEvent] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  
  const token = Cookies.get('auth_token');
  const decodedToken = token ? jwtDecode(token) : null;
  const idUser = decodedToken ? decodedToken.userId : null;

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.post("https://projet-b3.onrender.com/api/fetch-user-events", {
          eventIds: [eventId],
        });

        if (response.data.length > 0) {
          const event = response.data[0];
          setEventData(event);
          setTitle(event.title);
          setDescription(event.description);
          setLocation(event.location);
          setCategory(event.category);
          setDateEvent(event.dateEvent ? event.dateEvent.split("T")[0] : "");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('category', category);
      formData.append('dateEvent', new Date(dateEvent).toISOString());
      
      if (image) {
        formData.append('image', image, image.name);
      }

      await axios.post(`https://projet-b3.onrender.com/api/update/${eventId}/${idUser}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      setSuccessMessage("Événement mis à jour avec succès !");
      fetchEvents();
      navigate('/userDetails');
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de l'événement:", error);
    }
  };

  if (!eventData) {
    return <div>Chargement de l'événement...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 p-5">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">Modifier l'Événement</h1>
        
        {successMessage && (
          <div className="mb-4 text-green-600 text-center">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleUpdateEvent} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-gray-700">Catégorie :</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full" required>
              {["culturel", "sportif", "communautaire", "musique", "théâtre", 
                "conférence", "festival", "art", "bien-être", "éducation", 
                "technologie", "gastronomie", "environnement", "mode", "entrepreneuriat", 
                "littérature", "caritatif", "cinéma", "famille", "voyage"
              ].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Titre :</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-gray-700">Description :</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full" rows="4" required></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Lieu :</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-gray-700">Date de l'événement :</label>
            <input type="date" value={dateEvent} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDateEvent(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-gray-700">Image :</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border border-gray-300 rounded-lg p-2 w-full" />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
            Mettre à jour l'événement
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;