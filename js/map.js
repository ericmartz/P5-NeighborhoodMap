var map;
var mapMarkers = [];

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.74900, lng: -84.38798},
    scrollwheel: false,
    zoom: 12
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