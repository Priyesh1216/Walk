let map;
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 45.5017, lng: -73.5673 }, // Montreal
    zoom: 12
  });
};
