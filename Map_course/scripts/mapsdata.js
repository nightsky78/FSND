// Create a map variable
var map;

// Create a blank array for all the markers.
var markers = [];

// first specify the locations of the marker
// These are my favorite locations.
var locations = [
    {title: 'Home', location: {lat: 40.9795154, lng: -73.7280644}},
    {title: 'Work', location: {lat: 41.0349328, lng: -74.07302439999999}},
    {title: 'School', location: {lat: 41.012505, lng: -73.7344567}},
    {title: 'Church', location: {lat: 41.022505, lng: -73.7344567}},
    {title: 'Elevation_Burger', location: {lat: 41.032505, lng: -73.7344567}},
    {title: 'Japanese', location: {lat: 41.042505, lng: -73.7344567}},
    {title: 'Beerhouse', location: {lat: 41.052505, lng: -73.7344567}},
    {title: 'Kiga', location: {lat: 41.062505, lng: -73.7344567}}
    ];


// Create array for the marker label
var label = ['A','B', 'C','D','E','F','G', 'H'];


// Complete the following function to initialize the map
function initMap() {
    // create the styles.
    // Each feature style gets its own entry
    var styles = [
        {
            featureType: 'water',
            stylers: [
                {color: '#40e0d0'} // light blue
                ]
        },{
            featureType: 'administrative',
            elementType: 'label.text.stroke',
            stylers: [
                {color: '#2B292E'}, // anthracite
                {weight: 0.5 } // line thickness of text
            ]
        }
    ]

    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.979766, lng: -73.728107},
    zoom: 13,
    // add the styles to the map
    styles: styles
});

// inside the initMap function we add a marker

// create the InfoWindow
var largeInfoWindow = new google.maps.InfoWindow();

// Initialize the drawing manager. It requieres that the drawing library is loaded.
/* var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON
            ]
          }
        });
*/

// create custom style for my markers by calling my function makeMarkerIcon and passing in a color.
var defaultIcon = makeMarkerIcon('0091FF');
var highlightedIcon = makeMarkerIcon('FFFF24');

// create the bounds
var bounds = new google.maps.LatLngBounds();

// loop through the locations to create multiple markers
for (var i = 0; i < locations.length; i++) {
    // get the title and the position from the local array
    var position = locations[i].location;
    console.log('This is the location passed into the marker, lat: ' + position.lat + ' long: ' + position.lng );

    var title = locations[i].title;
    console.log('This is the title passed into the marker: ' + title);


    // Create a marker for each location
    var marker = new google.maps.Marker({
        position : position,
        map : map,
        label: label[i],
        title: title,
        icon: defaultIcon, // This is the default ICON from above with the special properties
        animation: google.maps.Animation.DROP,
        id: i
        });

    // append the marker in the predefined markers array
    markers.push(marker);

    //extend the bounds of the view area of the map using the bounds extend function
    bounds.extend(marker.position);

    // debug entry
    console.log('This is the title of marker: ' + marker.title);
    console.log('This is the location of the marker, lat: ' + marker.position.lat() + ' long: ' + marker.position.lng() );


    // Create event listener for each marker
    // passing in the marker, which is "this"
    // and populate the Info Window specific to that marker.
    // large Info Window is created below.
    marker.addListener('click', function(){
        populateInfoWindow(this, largeInfoWindow);
    });

    // adding the event listener to change the marker Icon back and forth based on the mouse
    marker.addListener('mouseover', function(){
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function(){
        this.setIcon(defaultIcon);
    });

    // add eventlistener for polygon drawing
    /*    document.getElementById('toggle-drawing').addEventListener('click', function(){
        toggleDrawing(drawingManager);
    })*/

    // fit the maps to the bounds
    map.fitBounds(bounds);
}

// This function populate the marker window when the marker is clicked.
// the "this" marker and the "largeInfoWindow" is passed as argument
function populateInfoWindow(marker, infowindow) {
    // Check if infowindow is already open
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
        });

        // Create new StreetViewService Object
        var streetViewService = new google.maps.StreetViewService();
        // define a radius to place the viewpoint where imagery exists.
        var radius = 50;

        // define the getstreetview function to get the image and add it to the content of the marker.
        function getStreetView(data, status){
            // debug Entry
            console.log('Is there a image? ' + status);
            if (status == google.maps.StreetViewStatus.OK){
                // position of the street view image
                var nearStreetViewLocation = data.location.latLng;
                //calculate the heading from the nearStreetViewLocation to the marker position.
                // needs the geometry library
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position)
                    // find the right image and add content
                   // Set content to the streetview image of the location
                // debug entry
                console.log('Heading of streetview: ' + heading);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                // set panoramaoption
                // the size is determined by the CSS stile of pano
                var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                    heading: heading,
                    pitch: 30
                }
                };
                // create panorama object and put it inside the infowindow at the id of the pano
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
                // debug entry
                console.log(panorama);
            } else {
                infowindow.setContent('<div> No Stree View Found</div>')
            };
        };


        // Call the streetviewservice function to get the panorama in a certain radius for position.
        // it passes the marker position the radius an get getStreetView as callback.
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        // open the infowindow on the marker.
        infowindow.open(map, marker);


    }


}

// Create the function to create a new marker with custom color on the map
function makeMarkerIcon(markerColor){
    var markerImage = new google.maps.MarkerImage(
        'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10,34),
        new google.maps.Size(21,34)
        );
    return markerImage
}


// function to toggle the display of the polygon menu
/*
function toggleDrawing(drawingManager){
    if(drawingManager.map) {
    drawingManager.setMap(null);
    }else{
        drawingManager.setMap(map);
    }
}*/

}

// geting the position of the marker.
//var m_lat = markers[0].getPosition().lat();
//var m_lng = markers[0].getPosition().lng();
//console.log(m_lat)
//console.log(m_lng)

