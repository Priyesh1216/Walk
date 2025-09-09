let map, userMarker, AdvancedMarkerClass;

// Helper function
function el(id) {
  return document.getElementById(id);
}

function setStatus(msg) {
  const results = document.getElementById("results");
  if (results) results.innerHTML = `<div class="muted">${msg}</div>`;
}

// Initialize the map (modular loader)
window.initMap = async function () {
  const { Map } = await google.maps.importLibrary("maps");
  try {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    AdvancedMarkerClass = AdvancedMarkerElement;
  }

  catch {
    AdvancedMarkerClass = null; // fallback later
  }

  map = new Map(document.getElementById("map"), {
    center: { lat: 45.5017, lng: -73.5673 }, // Montreal
    mapId: "18152c697f1e27a89734557b",
    zoom: 12
  });
};

function updateMinutesLabel() {
  var slider = el("maxMins");
  var out = el("minsOut");

  if (slider !== null && out !== null) {
    out.textContent = slider.value;
  }
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position.coords),
      error => reject(error),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

}

// Add the marker on the map (for user location)
function addUserMarker(lat, lng) {

  // Remove old marker (if exists)
  if (userMarker) {
    if (typeof userMarker.setMap === "function") {
      userMarker.setMap(null);
    }

    else {
      userMarker.map = null;

    }
  }
  userMarker = new AdvancedMarkerClass({
    map,
    position: { lat, lng },
    title: "You are here"
  });
}


// Live slider label
// Find the slider element (range input)
var slider = el("maxMins");

// Confirm it exists
if (slider !== null) {
  // When the slider changes, call updateMinutesLabel()
  slider.addEventListener("input", updateMinutesLabel);

  // Call once at the start so label shows the initial value
  updateMinutesLabel();
}

// Find button
var testButton = el("findBtn");
if (testButton !== null) {
  testButton.addEventListener("click", async function () {
    try {
      setStatus("Finding your location…");
      const coords = await getPosition();
      const lat = coords.latitude;
      const lng = coords.longitude;

      map.setCenter({ lat, lng });
      addUserMarker(lat, lng);

      setStatus("Marker placed at your location");
    }

    catch (err) {
      console.error(err);
    }
  });
}

// ---- Load Maps script with key from /config ----
(async function loadMaps() {
  try {
    const res = await fetch("/config");
    const { mapsKey } = await res.json();
    if (!mapsKey) {
      console.error("Missing GOOGLE_MAPS_API_KEY");
      setStatus("Maps key missing. Check server .env (GOOGLE_MAPS_API_KEY).");
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(mapsKey)}&libraries=marker&callback=initMap`;
    document.head.appendChild(s);
  } catch (e) {
    console.error(e);
    setStatus("Failed to load Google Maps. Check /config endpoint and network.");
  }
})();
