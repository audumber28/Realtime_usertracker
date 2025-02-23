const socket = io();
const markers = {}; // Store multiple user markers

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            
            // Emit location to the server
            socket.emit("sendLocation", { latitude, longitude });
        },
        (error) => {
            console.error("Error getting location:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

// Initialize Leaflet Map
const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

socket.on("receiveLocation", (data) => {
    const { latitude, longitude, id } = data; // Get id from data

    // Move the map view to the received location
    map.setView([latitude, longitude]);

    if (markers[id]) {
        // Move existing marker
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker for this user
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
