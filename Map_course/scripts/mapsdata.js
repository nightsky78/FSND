 // Create a map variable
  var map;
 // Complete the following function to initialize the map
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.979766, lng: -73.728107},
      zoom: 13
    });
  // inside the initMap function we add a marker
  // first specify the location of the marker
    var home = {lat: 40.979766, lng: -73.728107};

    var marker = new google.maps.Marker({
        position : home,
        map : map,
        label: "A",
        title: 'Thats where I lived!'
        });
  // geting the position of the marker.
    var m_lat = marker.getPosition().lat();
    var m_lng = marker.getPosition().lng();
    console.log(m_lat)
    console.log(m_lng)
  // Now we want to create an infowindow which pops up when the marker is clicked
    var infowindow = new google.maps.InfoWindow({
        content: "Here was out house where we spent 5 awesome years! Lat: " + m_lat + "  Long: " + m_lng
    });
    // the marker function created above does have a event listener function
    marker.addListener('click',function(){
        // infowindow opens on the map on the marker
        // if no marker is passed anchor point need to be created.
        infowindow.open(map, marker);
    });
  }