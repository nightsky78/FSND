// Create a map variable
var map;

// Create a blank array for all the markers.
var markers = [];

// Complete the following function to initialize the map
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 40.979766, lng: -73.728107},
  zoom: 13
});
// inside the initMap function we add a marker
// first specify the locations of the marker
// These are my favorite locations.
var locations = [
    {title: 'home', location: {lat: 40.9795154, lng: -73.72806439999999}},
    {title: 'Work', location: {lat: 41.034806, lng: -74.1079578}},
    {title: 'School', location: {lat: 41.012505, lng: -73.7344567}},
    {title: 'Church', location: {lat: 41.022505, lng: -73.7344567}},
    {title: 'Elevation_Burger', location: {lat: 41.032505, lng: -73.7344567}},
    {title: 'Japanese', location: {lat: 41.042505, lng: -73.7344567}},
    {title: 'Beerhouse', location: {lat: 41.052505, lng: -73.7344567}},
    {title: 'Kiga', location: {lat: 41.062505, lng: -73.7344567}}
    ];

var largeInfoWindow = new google.maps.InfoWindow();

// Create array for the marker label
var label = ['A','B', 'C','D','E','F','G'];

// loop through the locations to create multiple markers
for (var i = 0; i < locations.length; i++) {
    // get the title and the position from the local array
    var position = locations[i].location;
    var title = locations[i].title;
    console.log(title);

    // Create a marker for each location
    var marker = new google.maps.Marker({
        position : position,
        map : map,
        label: label[i],
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
        });

    // append the marker in the predefined markers array
    markers.push(marker);

    // Create event listener for each marker
    // passing in the marker, which is "this"
    // and populate the Info Window specific to that marker.
    // large Info Window is created below.
    marker.addListener('click', function(){
        populateInfoWindow(this, largeInfoWindow);
    });

}

// This function populate the marker window when the marker is clicked.
// the "this" marker and the "largeInfoWindow" is passed as argument
function populateInfoWindow(marker, infowindow) {
    // Check if infowindow is already open
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        console.log(marker.title);
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Clear marker property if the window is closed
        infowindow.addListener('closeclick', function(){
            infowindow.marker = null;
        });
    }


}

// geting the position of the marker.
var m_lat = markers[0].getPosition().lat();
var m_lng = markers[0].getPosition().lng();
console.log(m_lat)
console.log(m_lng)

}