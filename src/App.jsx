import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { fetchBooks, fetchLocationsWithDescriptions } from "./services/bookService";
import { useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Tooltip } from "react-leaflet";



function SmoothMarker({ location }) {
  const map = useMap();

  const handleClick = () => {
    map.flyTo([location.latitude, location.longitude], 10, {
      animate: true,
      duration: 1.5,
    });
  };

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      eventHandlers={{ click: handleClick }}
    >
      {/* Tooltip and Popup */}
      <Tooltip>{location.name}</Tooltip>
      <Popup>
        <h4>{location.name}</h4>
        <p>{location.description}</p>
      </Popup>
    </Marker>
  );
}


function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [locations, setLocations] = useState([]);
  const [fictionalLocations, setFictionalLocations] = useState([]);
  const [showLocations, setShowLocations] = useState(true);
const [showFictionalLocations, setShowFictionalLocations] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const filteredLocations = locations.filter((loc) =>
  loc.name.toLowerCase().includes(searchQuery.toLowerCase())
);



  useEffect(() => {
    const loadBooks = async () => {
      const data = await fetchBooks();
      setBooks(data);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    const loadLocations = async () => {
      if (selectedBook) {
        const data = await fetchLocationsWithDescriptions(selectedBook.id);
        const fictional = data.filter((loc) => !loc.latitude || !loc.longitude);
        const nonFictional = data.filter((loc) => loc.latitude && loc.longitude);
        setFictionalLocations(fictional);
        setLocations(nonFictional);
      } else {
        setLocations([]);
        setFictionalLocations([]);
      }
    };
    loadLocations();
  }, [selectedBook]);

  useEffect(() => {
    const map = document.querySelector(".leaflet-container")?.__reactLeafletInternals?.map;
    if (locations.length > 0 && map) {
      const firstLocation = locations[0];
      map.flyTo([firstLocation.latitude, firstLocation.longitude], 5, {
        animate: true,
        duration: 1.5,
      });
    } else if (!locations.length && map) {
      map.flyTo([0, 0], 2, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [locations]);

  return (
    
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div className={`sidebar ${selectedBook ? "loaded" : "loading"}`} style={{ width: "30%", padding: "1rem", background: "#f4f4f4", overflowY: "auto" }}>
      <input
  type="text"
  placeholder="Search locations..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  style={{
    width: "100%",
    padding: "0.5rem",
    margin: "1rem 0",
    borderRadius: "4px",
    border: "1px solid #ddd",
  }}
/>

        <h1>LitMaps: Book Locations</h1>
        <select
          value={selectedBook?.id || ""}
          onChange={(e) =>
            setSelectedBook(books.find((book) => book.id === Number(e.target.value)))
          }
        >
          <option value="">Select a Book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>

        <h3 style={{ marginTop: "20px" }}>Locations</h3>
        {locations.length === 0 && fictionalLocations.length === 0 ? (
          <p>No locations available for this book.</p>
        ) : (
          <>


// Update JSX for collapsible sections
<div>
  <h3 onClick={() => setShowLocations(!showLocations)} style={{ cursor: "pointer" }}>
    Locations {showLocations ? "▼" : "▲"}
  </h3>
  {showLocations && (
    <ul>
      {locations.map((loc, idx) => (
        <li key={idx}>
          <h4>{loc.name}</h4>
          <p>{loc.description}</p>
        </li>
      ))}
    </ul>
  )}

  {fictionalLocations.length > 0 && (
    <>
      <h3 onClick={() => setShowFictionalLocations(!showFictionalLocations)} style={{ cursor: "pointer" }}>
        Fictional Locations {showFictionalLocations ? "▼" : "▲"}
      </h3>
      {showFictionalLocations && (
        <ul>
          {fictionalLocations.map((loc, idx) => (
            <li key={idx}>
              <h4>{loc.name}</h4>
              <p>{loc.description || "This is a fictional location, and it will manifest soon."}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</div>

          </>
        )}
      </div>

      <div style={{ flex: 1 }}>
        {locations.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <h2>These locations are manifesting into reality. They’ll be here soon!</h2>
          </div>
        ) : (
          <MapContainer
          className="MapContainer"
          center={[0, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        
          {locations.map((loc, idx) => (
            <SmoothMarker key={idx} location={loc} />
          ))}
        </MapContainer>
        
        )}
      </div>
    </div>
  );
}

export default App;
