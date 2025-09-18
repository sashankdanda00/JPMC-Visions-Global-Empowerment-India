import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Admin.css"; // Your CSS

// Fix Leaflet icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function AdminPage() {
  // Form fields
  const [ceName, setCeName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [qualification, setQualification] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [locationName, setLocationName] = useState("");

  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");
  const [userPosition, setUserPosition] = useState(null);

  // Hardcoded Points for Map Demo
  const pointA = { lat: 17.385044, lng: 78.486671 };
  const pointB = { lat: 17.444, lng: 78.467 };
  const distanceAB = getDistanceInKm(pointA.lat, pointA.lng, pointB.lat, pointB.lng);

  // Fetch all locations on mount and after add
  const fetchLocations = () => {
    fetch("http://localhost:3000/admin/get-all-locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Failed to fetch locations", err));
  };

  useEffect(() => {
    fetchLocations();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, []);

  // Add CE handler
  const handleAddCE = async (e) => {
    e.preventDefault();
    if (!ceName || !email || !age || !qualification || !phone || !gender || !locationName) {
      setMessage("Please fill all CE details and location.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/admin/add-ce", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ceName,
          email,
          age: parseInt(age),
          qualification,
          phone,
          gender,
          locationName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✔️ CE added successfully.");
        setCeName("");
        setEmail("");
        setAge("");
        setQualification("");
        setPhone("");
        setGender("");
        setLocationName("");
        fetchLocations();
      } else {
        setMessage(data.message || "Error adding CE.");
      }
    } catch (err) {
      setMessage("Server error.");
    }
  };

  // Add Location only
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!locationName) {
      setMessage("Please enter location name.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/admin/add-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✔️ Location added successfully.");
        setLocationName("");
        fetchLocations();
      } else {
        setMessage(data.message || "Error adding location.");
      }
    } catch (err) {
      setMessage("Server error.");
    }
  };

  return (
    <div className="admin-fullpage">
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel</h1>
        <form className="admin-form">
          <div className="admin-form-group">
            <label>Name</label>
            <input
              type="text"
              value={ceName}
              onChange={(e) => setCeName(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Qualification</label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Location Name</label>
            <input
              type="text"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              required
            />
          </div>
          <div style={{display: "flex", gap: "12px", alignItems: "flex-start"}}>
            <button
              type="button"
              className="admin-btn"
              onClick={handleAddCE}
            >
              Add CE
            </button>
            <button
              type="button"
              className="admin-btn"
              style={{ background: "#29ab60" }}
              onClick={handleAddLocation}
            >
              Add Location Only
            </button>
          </div>
        </form>
        {message && <p className="admin-message">{message}</p>}

        <div className="admin-locations-list">
          <h2>All Locations</h2>
          <ul>
            {locations.map((loc) => (
              <li key={loc._id} className="admin-location-item">
                <strong>{loc.locationName || loc.location || "No Location"}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-map-section">
          <h2>Map View</h2>
          <MapContainer
            center={[17.415, 78.476]}
            zoom={12}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[pointA.lat, pointA.lng]}>
              <Popup>📍 Point A</Popup>
            </Marker>
            <Marker position={[pointB.lat, pointB.lng]}>
              <Popup>📍 Point B</Popup>
            </Marker>
            <Polyline
              positions={[
                [pointA.lat, pointA.lng],
                [pointB.lat, pointB.lng],
              ]}
              pathOptions={{ color: "red", weight: 3 }}
            />
            <Popup
              position={[
                (pointA.lat + pointB.lat) / 2,
                (pointA.lng + pointB.lng) / 2,
              ]}
            >
              📏 Distance: <strong>{distanceAB.toFixed(2)} km</strong>
            </Popup>
            {userPosition && (
              <>
                <Marker position={[userPosition.lat, userPosition.lng]}>
                  <Popup>Your Location</Popup>
                </Marker>
                <Circle
                  center={[userPosition.lat, userPosition.lng]}
                  radius={5000}
                  pathOptions={{ fillColor: "blue", fillOpacity: 0.2 }}
                />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
