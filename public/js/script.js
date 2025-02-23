const socket = io();
const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
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

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

socket.on("receiveLocation", (data) => {
    const { latitude, longitude, id } = data;
    map.setView([latitude, longitude]);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
