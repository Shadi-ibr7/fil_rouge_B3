import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const idUser = decodedToken.userId;

  if (!token) {
    console.log("Utilisateur non identifié. Veuillez vous connecter.");
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.log("Utilisateur non connecté");
        return;
      }

      try {
        const request = await axios.get(`http://localhost:3002/api/fetch-user/${idUser}`);
        setAdminData(request.data[0]);

        if (request.data[0].participatedEvents.length > 0) {
          fetchEvents(request.data[0].participatedEvents);
        } else {
          setIsLoading(false); // Aucun événement, donc on termine le chargement
        }
      } catch (error) {
        console.error("Erreur lors du fetch de l'utilisateur:", error);
      }
    };

    fetchUser();
  }, [token, idUser]);

  const fetchEvents = async (eventIds) => {
    try {
      const response = await axios.post("http://localhost:3002/api/fetch-user-events", { eventIds });
      const transformedEvents = response.data.map((event) => ({
        ...event,
        imageUrl: `data:image/jpeg;base64,${btoa(
          new Uint8Array(event.image.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
        )}`,
      }));

      setEvents(transformedEvents);
      setIsLoading(false); // On termine le chargement dès que les événements sont récupérés
    } catch (error) {
      console.error("Erreur lors du fetch des événements:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 p-5">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">Page Administrateur</h1>

        {adminData ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Nom :</p>
              <p className="text-lg text-gray-800">{adminData.username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Email :</p>
              <p className="text-lg text-gray-800">{adminData.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Numéro de téléphone :</p>
              <p className="text-lg text-gray-800">0{adminData.phoneNumber}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Rôle :</p>
              <p className="text-lg text-gray-800">{adminData.role}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Événements participés :</p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {isLoading ? (
                  <div className="w-full text-center p-4 text-gray-500">
                    <span>Chargement des événements...</span>
                  </div>
                ) : (
                  events.length > 0 ? (
                    events.map((event, index) => (
                      <li key={index} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-100">
                        <img src={event.imageUrl} alt={event.title} className="h-40 w-full object-cover" />
                        <div className="p-2">
                          <p className="font-medium text-teal-800">{event.title}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucun événement trouvé.</p>
                  )
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Chargement des données...</div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
