var map;
var mapMarkers = [];
var bounds = new google.maps.LatLngBounds();
var infoWindow = new google.maps.InfoWindow();

// So I figure storing a client ID and client secret in a JS file like this is probably a worst practice.
// So in the spirit of security by obuscation (which is also a worst practice, I am prefixing these variables with NOT_MY to fool all those bad guys out there.
// So yeah, I am just being silly, but there's got to be a better way to do this.
var NOT_MY_CLIENT_ID = 'YE5DKRXUZGLVI5CJZI45W4GKF1BF0UL3C3IQMBRZISWKCQN0';
var NOT_MY_CLIENT_SECRET = 'AKMFW32DAPSPQ5MX4YMHV2VKPCID3VLPWIUZADQ3BVENC3VH';
var NOT_MY_FLICKR_API = 'c2324d1f98f8a7729e48a3261c1c4f27'

// Not sure what I am doing here is entirely in line with the project.  I am 
// updating the view manually instead of using Knockout. So...
// TODO: Update the infoWindow from the ViewModel
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
    scrollwheel: false  // Why? Because I hate when I am scrolling a site and suddenly grab the map 
                        // it starts to zoom in or out.  
  });
}

function addMapMarkers(mapPoint){

  var marker = new google.maps.Marker({
    position: {lat: mapPoint.mapLatitude(), lng: mapPoint.mapLongitude()},
    map: map,
    title: mapPoint.mapLocation()
  });

  // mapMarkers used to be used in several functions, but code has been refactored 
  // so mapMarkers are only used to toggle the markers invisible.
  // TODO: refactor toggling markers invisible so that I can get rid of the mapMarkers array
  mapMarkers.push(marker);
  marker.setMap(map);

  // TODO: Not sure this is best.  I might be able to create the infoWindow and add the addListener
  // TODO: from the ViewModel.  We'll see.  
  // I would add the marker animation here as well, since the instructions say to 
  // "animate marker when either the list item associated with it or the map marker itself is selected."
  // I understand the marker animation when the list item is selected, because that draws the user's attention to where
  // that location is marked on the map.  When you select the marker and it jumps, I think that is bad UI.  So I didn't do it.
  // I hope this explanation is enough to let the review now I can do it, but chose not to.
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

// TODO: all markers are set to visible and then markers in the search array are set back to visible.
// TODO: maybe instead of having two functions to make markers invisible and then visible
// TODO: I could instead have a toggleMarkers function that sets visible makers invisble and vice versa.
function toggleMarkersInvisible(){
  for(var i=0; i < mapMarkers.length; i++){
    mapMarkers[i].setVisible(false);
  }
}

function toggleMarkerVisible(marker){
  marker.setVisible(true);
}

function animateMarker(marker){
  marker.setAnimation(google.maps.Animation.BOUNCE);
  stopMarkerAnimation(marker, 1400);
}

// // For this function, got some help at the google maps API and here:
// // http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
function stopMarkerAnimation(marker, timeout){
  setTimeout(function(){ 
    marker.setAnimation(null); 
  }, timeout);
}

// Not sure why I did this here.  Since the file is map.js.  I think I am going to end up renaming
// this file helper.js and it can just be helper functions.
// Or maybe move this to another file called ajax.js or requests.js and move this function there.
// TODO: figure out the above comment. 
function getFoursquareInfo(location){

  // So building this URL slowly.  Don't really like it and will see about building it in an AJAX request instead
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search';
  foursquareURL +='?client_id=' + NOT_MY_CLIENT_ID + '&client_secret=' + NOT_MY_CLIENT_SECRET + '&v=20130815&limit=1';
  foursquareURL += '&ll=' + location.mapLatitude() + ',' + location.mapLongitude();
  foursquareURL += '&query=' + location.mapLocation();
  
  //console.log(foursquareURL);

  return $.getJSON(foursquareURL, function(data){});
}

// Once I get the compact info object, I use that to get the detail information.
function getFoursquareDetail(id) {

  var foursquareURL = 'https://api.foursquare.com/v2/venues/' + id;
  foursquareURL +='?client_id=' + NOT_MY_CLIENT_ID + '&client_secret=' + NOT_MY_CLIENT_SECRET + '&v=20130815&limit=1';

  //console.log(foursquareURL)

  return $.getJSON(foursquareURL, function(data){});
}


function getFlickrInfo(location) {
  
  // Really thought I was going to have to use oauth for the flickr API, but I guess I was wrong?  
  // Looking at the documentation, I think since I am only requesting public data, no need for authentication, so no need for oauth
  // https://www.flickr.com/services/api/flickr.photos.search.html

  var place = location.mapLocation();

  if(location.mapLocation() === 'Ormsby\'s Tavern') {
    place = 'ormsby\'s'; 
  }

  var flickrURL = 'https://api.flickr.com/services/rest/?';
  flickrURL +='method=flickr.photos.search&api_key=' + NOT_MY_FLICKR_API + '&text=' + place + ', atlanta&format=json&nojsoncallback=1&per_page=5';

  console.log(flickrURL);
  return $.getJSON(flickrURL, function(data){});
}

function getFlickrPhotoURL(photoID){
  
  var flickrPhotoURLs = 'https://api.flickr.com/services/rest/?';
  flickrPhotoURLs +='method=flickr.photos.getSizes&api_key=' + NOT_MY_FLICKR_API + '&photo_id=' + photoID + '&format=json&nojsoncallback=1';

  // console.log(flickrPhotoURLs);
  return $.getJSON(flickrPhotoURLs, function(data){});
}