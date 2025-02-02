import { useLocation } from "react-router-dom";

function ResultsPage() {
  const location = useLocation();
  const filteredEvents = location.state?.filteredEvents || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Résultats de la recherche</h1>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              {event.image && (
                <img
                  src={`${event.image}`}
                  alt={event.title}
                  className="w-full h-56 object-cover mb-4"
                />
              )}
              <div className="p-4">
                <h2 className="text-2xl font-semibold text-gray-900">{event.title}</h2>
                <p className="text-gray-600 mb-3">{event.description}</p>
                <div className="text-gray-500 mb-3">
                  <p><span className="font-semibold">Catégorie:</span> {event.category}</p>
                  <p><span className="font-semibold">Créé par:</span> {event.createdBy}</p>
                  <p><span className="font-semibold">Date de événement:</span> {new Date(event.dateEvent).toLocaleDateString()}</p>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucun événement trouvé.</p>
      )}
    </div>
  );
}

export default ResultsPage;
