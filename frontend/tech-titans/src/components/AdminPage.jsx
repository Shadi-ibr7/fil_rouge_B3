import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from "../ThemeContext";

const AdminPage = ({ getToken }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [adminData, setAdminData] = useState(null);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const token = getToken();
    if (!token) {
        console.log("Utilisateur non identifié. Veuillez vous connecter.");
        return null;
    }

    const decodedToken = jwtDecode(token);
    const idUser = decodedToken.userId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const request = await axios.get(`https://projet-b3.onrender.com/api/fetch-user/${idUser}`);
                setAdminData(request.data[0]);

                const userEmail = request.data[0].email;

                if (request.data[0].participatedEvents.length > 0) {
                    fetchParticipatedEvents(request.data[0].participatedEvents);
                }

                fetchCreatedEvents(userEmail);
            } catch (error) {
                console.error("Erreur lors du fetch de l'utilisateur:", error);
            }
        };

        fetchUser();
    }, [idUser]);

    const fetchParticipatedEvents = async (eventIds) => {
        try {
            const response = await axios.post("https://projet-b3.onrender.com/api/fetch-user-events", { eventIds });
            const transformedEvents = response.data.map((event) => ({
                ...event,
                imageUrl: `data:image/jpeg;base64,${btoa(
                    new Uint8Array(event.image.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
                )}`,
            }));
            setParticipatedEvents(transformedEvents);
            setIsLoading(false);
        } catch (error) {
            console.log("Erreur lors du fetch des événements auxquels l'utilisateur a participé:", error);
            setIsLoading(false);
        }
    };

    const fetchCreatedEvents = async (userEmail) => {
        try {
            const response = await axios.get(`https://projet-b3.onrender.com/api/fetch-created-events/${userEmail}`);
            const transformedEvents = response.data.map((event) => ({
                ...event,
                imageUrl: `data:image/jpeg;base64,${btoa(
                    new Uint8Array(event.image.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
                )}`,
                createdByEmail: event.createdBy
            }));

            setCreatedEvents(transformedEvents);
        } catch (error) {
            console.error("Erreur lors du fetch des événements créés par l'utilisateur:", error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`https://projet-b3.onrender.com/api/event/${eventId}`, {
                data: { userId: idUser },
            });

            setCreatedEvents(createdEvents.filter(event => event._id !== eventId));
            console.log("Événement supprimé avec succès.");
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement:", error);
        }
    };

    const handleEditEvent = (eventId) => {
        navigate(`/edit-event/${eventId}`);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'} p-5`}>
            <div className="container mx-auto max-w-6xl">
                {/* En-tête avec animation */}
                <div className={`mb-10 text-center p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} transform transition-all duration-500 hover:shadow-2xl`}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-in">
                        Tableau de Bord
                    </h1>
                    <p className="text-gray-200 text-lg">
                        Gérez vos événements et suivez vos participations
                    </p>
                </div>

                {adminData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profil utilisateur */}
                        <div className={`lg:col-span-1 rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                            <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-800 to-indigo-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white`}>
                                <h2 className="text-xl font-bold mb-1">Profil</h2>
                                <p className="text-sm opacity-80">Informations personnelles</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                    <p className={`font-semibold ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`}>Nom</p>
                                    <p className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{adminData.username}</p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                    <p className={`font-semibold ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`}>Email</p>
                                    <p className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{adminData.email}</p>
                                </div>
                               
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Section événements participés */}
                            <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                                <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-800 to-indigo-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white`}>
                                    <h2 className="text-xl font-bold mb-1">Événements auxquels vous participez</h2>
                                    <p className="text-sm opacity-80">Vos inscriptions actuelles</p>
                                </div>
                                <div className="p-6">
                                    {isLoading ? (
                                        <div className={`w-full text-center p-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className="animate-pulse flex flex-col items-center">
                                                <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
                                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        participatedEvents.length > 0 ? (
                                            <ul className="grid gap-4 sm:grid-cols-2">
                                                {participatedEvents.map((event, index) => (
                                                    <li key={index} className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-blue-100 bg-white'} shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105`}>
                                                        <div className="relative h-40">
                                                            <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                            <h3 className="absolute bottom-2 left-3 text-white font-bold text-lg">{event.title}</h3>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                                                                {event.description?.substring(0, 80)}...
                                                            </p>
                                                            
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                                    Vous ne participez à aucun événement pour le moment.
                                                </p>
                                                <Link 
                                                    to="/AllEvent" 
                                                    className={`inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                                        isDarkMode 
                                                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30' 
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
                                                    }`}
                                                >
                                                    Découvrir des événements
                                                </Link>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Section événements créés */}
                            <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                                <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-800 to-indigo-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white`}>
                                    <h2 className="text-xl font-bold mb-1">Événements que vous avez créés</h2>
                                    <p className="text-sm opacity-80">Gérez vos événements</p>
                                </div>
                                <div className="p-6">
                                    {createdEvents.length > 0 ? (
                                        <ul className="grid gap-6 sm:grid-cols-2">
                                            {createdEvents.map((event, index) => (
                                                <li key={index} className={`overflow-hidden rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-blue-100 bg-white'} shadow-md transition-all duration-300 hover:shadow-xl`}>
                                                    <div className="relative h-40">
                                                        <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                        <h3 className="absolute bottom-2 left-3 text-white font-bold text-lg">{event.title}</h3>
                                                    </div>
                                                    <div className="p-4">
                                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                                            {event.description?.substring(0, 80)}...
                                                        </p>
                                                        <div className="flex space-x-3">
                                                            <button
                                                                onClick={() => handleEditEvent(event._id)}
                                                                className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
                                                                    isDarkMode 
                                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/30' 
                                                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30'
                                                                }`}
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteEvent(event._id)}
                                                                className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
                                                                    isDarkMode 
                                                                    ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-red-500/30' 
                                                                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-red-500/30'
                                                                }`}
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                                Vous n'avez créé aucun événement pour le moment.
                                            </p>
                                            <Link 
                                                to="/addEvent" 
                                                className={`inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                                    isDarkMode 
                                                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30' 
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
                                                }`}
                                            >
                                                Créer un événement
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`text-center p-16 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-gray-300 mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                    </div>
                )}

                {/* Section "Découvrez tous les événements" */}
                <section className="mt-16 mb-8">
                    <div className={`bg-gradient-to-r ${isDarkMode ? 'from-purple-900 to-indigo-900' : 'from-blue-600 to-indigo-700'} p-8 sm:p-12 rounded-3xl shadow-xl text-center transform transition-all duration-500 hover:shadow-2xl`}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 animate-in">
                            Découvrez tous les événements
                        </h2>
                        <p className="text-base sm:text-lg text-gray-200 mb-8 animate-in max-w-2xl mx-auto">
                            Explorez des événements passionnants : conférences, concerts, ateliers et plus encore. 
                            Trouvez ce qui vous intéresse et rejoignez des expériences mémorables.
                        </p>
                        <div className="flex justify-center mt-6">
                            <Link
                                to="/AllEvent"
                                className="
                                    bg-white
                                    text-blue-700
                                    px-6
                                    sm:px-8
                                    py-3
                                    rounded-full
                                    text-lg
                                    font-semibold
                                    shadow-lg
                                    hover:bg-blue-50
                                    hover:shadow-xl
                                    transition-all
                                    duration-300
                                    animate-in
                                    transform hover:scale-105
                                "
                            >
                                Voir tous les événements
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Section "Créer un événement" */}
                <section className="mb-16">
                    <div className={`text-center ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-900 to-black'} p-8 sm:p-10 rounded-xl shadow-xl transform transition-all duration-500 hover:shadow-2xl`}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Créer un événement
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl mx-auto">
                            Créez des événements facilement et partagez-les avec vos participants. 
                            Rejoignez notre plateforme et faites vivre des expériences uniques !
                        </p>
                        <Link
                            to="/addEvent"
                            className="
                                inline-block
                                bg-white
                                text-blue-600
                                px-6
                                py-3
                                rounded-full
                                text-lg
                                font-semibold
                                shadow-lg
                                hover:shadow-2xl
                                hover:bg-blue-600
                                hover:text-white
                                transition-all
                                duration-300
                                transform hover:scale-105
                            "
                        >
                            Créer un événement
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminPage;