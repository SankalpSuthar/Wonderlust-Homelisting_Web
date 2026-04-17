const defaultCenter = [28.6139, 77.209];
const coords = listing?.geometry?.coordinates || [defaultCenter[1], defaultCenter[0]];
const lng = Number(coords[0]);
const lat = Number(coords[1]);
const center = Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : defaultCenter;

const map = L.map("map").setView(center, 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.marker(center)
  .addTo(map)
  .bindPopup(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`);
