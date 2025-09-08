let map, userMarker;

// Helper function
function el(id) {
  return document.getElementById(id);
}

function setStatus(msg) {
  const results = document.getElementById("results");
  if (results) results.innerHTML = `<div class="muted">${msg}</div>`;
}

// Initialize the map
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 45.5017, lng: -73.5673 }, // Montreal
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


// Live slider label
// Find the slider element (range input)
var slider = el("maxMins");

// Confirm it exists
if (slider !== null) {
  // When the slider changes, call updateMinutesLabel()
  slider.addEventListener("input", updateMinutesLabel);

  //Call once at the start so label shows the initial value
  updateMinutesLabel();
}

// Find the test button
var testButton = el("findBtn");

// Again, check it exists before using it
if (testButton !== null) {
  testButton.addEventListener("click", function () {
    // Runs when the button is clicked
    setStatus("Status helper works");
  });
}

