var map;
var mapMarkers = [];
var bounds;
var infoWindow;
var vm;

// So I figure storing a client ID and client secret in a JS file like this is probably a worst practice.
// So in the spirit of security by obfuscation (which is also a worst practice), I am prefixing these variables with NOT_MY to fool all those bad guys out there.
// So yeah, I am just being silly, but there's got to be a better way to do this.
var NOT_MY_CLIENT_ID = 'YE5DKRXUZGLVI5CJZI45W4GKF1BF0UL3C3IQMBRZISWKCQN0';
var NOT_MY_CLIENT_SECRET = 'AKMFW32DAPSPQ5MX4YMHV2VKPCID3VLPWIUZADQ3BVENC3VH';
var NOT_MY_FLICKR_API = 'c2324d1f98f8a7729e48a3261c1c4f27';

var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/';
var FLICKR_BASE_URL = 'https://api.flickr.com/services/rest/?';

// Had to add initMap to the window object to get this working.  :-/
window.initMap = function() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.74900, lng: -84.38798},
    scrollwheel: false  // Why? Because I hate when I am scrolling a site and suddenly grab the map 
                        // it starts to zoom in or out.  
  });

  // Originally, these variables were declared and assigned above where the variables are just declared in lines 1-4
  // I had to move the assigning of variables here, but keep the declarations above to get this to work.
  // As far as I can tell, it is because the map api is declared after map.js is parsed by the browser.  So 'google' is not yet defined as 
  // a variable.  But I needed bounds and infoWindows to be available as global variables.
  // Maybe not a best practice, but it works.
  bounds = new google.maps.LatLngBounds();
  infoWindow = new google.maps.InfoWindow();

  // Originally the two lines below was just one:
  // ko.applyBindings(new ViewModel);
  // However, I needed to call clickedLocation in the VieWModel from my maps.even.addListener() (on line 66)
  // I looked at several stackoverflow questions, but this is the one that made it click:
  // http://stackoverflow.com/questions/26047660/calling-function-in-knockout-js-from-outside-view-model
  // Now the question I have to find out is if adding my ViewModel to the Window object is kosher :-/
  window.vm = new ViewModel();
  ko.applyBindings(window.vm);
}

function mapLoadError(){
  window.alert('There was a problem loading the map.  Sorry, try again later');
}

// Not sure what I am doing here is entirely in line with the project.
// I am setting the content for each infoWindow manually.  
// However, the view is still being updated by Google Map API?
// What I mean is that I am not messing with the dom, so to speak.
// Although the code below has tags in it, I don't think I am truy interacting with the DOM in the function below.
// So...
// POSSIBLE TODO: Figure out how to update the infoWindow from KO.
// Although, each marker has its own infoWindow, maybe this is best.  
// I am leaving as is for now, but maybe will come back to it.
function setInfoWindowContent(header, content, address) {
  var windowContent = '';

  var imgURL = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location=' + address;
  windowContent += '<h3>' + header + '</h3>';
  windowContent += '<p>' + content + '</p>';
  windowContent += '<img src="' + imgURL + '">';
  return windowContent;
}

// createInfoWindow() adds the click event of the marker to the event listener.
// It fires off the animateMarker function
// Then it fires off the clickedLocation function
// And then it sets the content
// And then it opens the infoWindow
function createInfoWindow(mapPoint) {
  google.maps.event.addListener(mapPoint.mapMarker(), 'click', function() {
    animateMarker(mapPoint.mapMarker());
    window.vm.handleInfoRequests(mapPoint);
    infoWindow.setContent(setInfoWindowContent(mapPoint.mapLocation(), mapPoint.mapNote(), mapPoint.mapLocationAddress()));
    infoWindow.open(map, mapPoint.mapMarker());
  });
}

// function initMap() {
//   // Create a map object and specify the DOM element for display.
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: 33.74900, lng: -84.38798},
//     scrollwheel: false  // Why? Because I hate when I am scrolling a site and suddenly grab the map 
//                         // it starts to zoom in or out.  
//   });
// }

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

// For this function, got some help at the google maps API and here:
// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
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
  var foursquareURL = FOURSQUARE_BASE_URL;
  foursquareURL += 'search?client_id=' + NOT_MY_CLIENT_ID + '&client_secret=' + NOT_MY_CLIENT_SECRET + '&v=20130815&limit=1';
  foursquareURL += '&ll=' + location.mapLatitude() + ',' + location.mapLongitude();
  foursquareURL += '&query=' + location.mapLocation();

  return $.getJSON(foursquareURL, function(data){});
}

// Once I get the compact info object, I use that to get the detail information.
function getFoursquareDetail(id) {

  var foursquareURL = FOURSQUARE_BASE_URL + id;
  foursquareURL +='?client_id=' + NOT_MY_CLIENT_ID + '&client_secret=' + NOT_MY_CLIENT_SECRET + '&v=20130815&limit=1';
  
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

  var flickrURL = FLICKR_BASE_URL + 'method=flickr.photos.search&api_key=' + NOT_MY_FLICKR_API + '&text=' + place + ', atlanta&format=json&nojsoncallback=1&per_page=5';

  return $.getJSON(flickrURL, function(data){});
}

function getFlickrPhotoURL(photoID){
  
  var flickrPhotoURLs = FLICKR_BASE_URL + 'method=flickr.photos.getSizes&api_key=' + NOT_MY_FLICKR_API + '&photo_id=' + photoID + '&format=json&nojsoncallback=1';

  return $.getJSON(flickrPhotoURLs, function(data){});
}