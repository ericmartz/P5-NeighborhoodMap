var map;
var mapMarkers = [];
var bounds = new google.maps.LatLngBounds();
var infoWindow = new google.maps.InfoWindow();

// So I figure storing a client ID and client secret in a JS file like this is probably a worst practice.
// So in the spirit of security by obuscation (which is also a worst practice, I am prefixing these variables with NOT_MY to fool all those bad guys out there.
// So yeah, I am just being silly, but there's got to be a better way to do this.
var NOT_MY_CLIENT_ID = 'YE5DKRXUZGLVI5CJZI45W4GKF1BF0UL3C3IQMBRZISWKCQN0';
var NOT_MY_CLIENT_SECRET = 'AKMFW32DAPSPQ5MX4YMHV2VKPCID3VLPWIUZADQ3BVENC3VH';

function getInfoWindowContent(header, content, address) {
  var windowContent = '';

  var imgURL = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location=' + address;
  windowContent += '<h3>' + header + '</h3>';
  windowContent += '<p>' + content + '</p>';
  windowContent += '<img src="' + imgURL + '">'
  return windowContent;
}

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.74900, lng: -84.38798},
    scrollwheel: false
    //zoom: 12
  });
}

function addMapMarkers(mapPoint){

  var marker = new google.maps.Marker({
    position: {lat: mapPoint.mapLatitude(), lng: mapPoint.mapLongitude()},
    map: map,
    title: mapPoint.mapLocation()
  });

  mapMarkers.push(marker);
  marker.setMap(map);

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(getInfoWindowContent(mapPoint.mapLocation(), mapPoint.mapNote(), mapPoint.mapLocationAddress()));
    infoWindow.open(map, marker);
  });

  // Got this from a couple articles I read, and then also the code in Project 2 
  bounds.extend(new google.maps.LatLng(mapPoint.mapLatitude(), mapPoint.mapLongitude()));
  map.fitBounds(bounds);
  map.setCenter(bounds.getCenter());

  return marker;
}

function toggleMarkersInvisible(){
  for(var i=0; i < mapMarkers.length; i++){
    mapMarkers[i].setVisible(false);
  }
}

function toggleMarkerVisible(marker){
  // console.log("ADDRESS:" + marker);
  for(var i=0; i < mapMarkers.length; i++){
    // console.log("MARKER:" + mapMarkers[i].title);
    if(marker === mapMarkers[i].title){
      mapMarkers[i].setVisible(true);
    }
  }
}

// // I am using a loop here, but I feel like there has to be a way to do this that costs less in terms
// // of computer resources.
// // TODO: Find out a way to do this without a loop.
function animateMarker(marker){
  for(var i=0; i < mapMarkers.length; i++){
    if(marker === mapMarkers[i].title){
      mapMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
      // Tried to stop the animation in the loop, but didn't work
      // My guess is that the loop is exited before the timeout occurs, so the timeout doesn't know which marker
      // to stop animating anymore.
      stopMarkerAnimation(i, 1400);
    }
  }
}

// // For this function, got some help at the google maps API and here:
// // http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
function stopMarkerAnimation(marker, timeout){
  setTimeout(function(){ 
    mapMarkers[marker].setAnimation(null); 
  }, timeout);
}

function getLocationInfo(location){

  // So building this URL slowly.  Don't really like it and will see about building it in an AJAX request instead
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search';
  foursquareURL +='?client_id=' + NOT_MY_CLIENT_ID + '&client_secret=' + NOT_MY_CLIENT_SECRET + '&v=20130815&limit=1';
  foursquareURL += '&ll=' + location.mapLatitude() + ',' + location.mapLongitude();
  foursquareURL += '&query=' + location.mapLocation();
  
  // console.log(foursquareURL);

  return $.getJSON(foursquareURL, function(data) {
    // Started out thinking I would need to add some sort of assignment variable, but after testing I don't.  
    // Just have to return the AJAX request.
    // var response = data;
  });
}