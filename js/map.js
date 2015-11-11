var mapMarkers = []
//function initializeMap() {

  //var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  // function locationFinder() {

  //   // initializes an empty array
  //   var locations = [];

  //   // adds the single location property from bio to the locations array
  //   locations.push(bio.contacts.location);

  //   // iterates through school locations and appends each location to
  //   // the locations array
  //   for (var school in education.schools) {
  //     locations.push(education.schools[school].location);
  //   }

  //   // iterates through work locations and appends each location to
  //   // the locations array
  //   // I added the if statement because my work info was producing a lot of doubles in the array.  Just figured it was
  //   // best to reduce this.  Also, it seemed to be causing a problem with adding map markers to the map, although I
  //   // haven't pin pointed why that is yet.
  //   // Worked on it for a bit, started using console.log() to produce output of what was happening when I noticed how many times
  //   // Peachtree City and Atlanta was in the array.  Tried to figure out why some places still were not being added.  When I added
  //   // the if statement the problem of some places not being added was fixed immediately.
  //   // I did console.log() google.maps.places.PlacesServiceStatus.OK in the callback function and after a few calls I got null results.
  //   // I felt google started blocking me after I made several method calls to their script.  Not sure this was the issue, but wanted to continue
  //   // with the project after an afternoon spent working on this one problem, and this seemed to get me in the right direction.
  //   for (var job in work.jobs) {
  //     // I noticed MDN had .includes() as a array method, but it was marked as experimental so I thought I would stay away from it for now.
  //     // However, at least I know it exists and will work well in the future, and checking for the index of an item isn't too complicated.
  //     if (locations.indexOf(work.jobs[job].location) === -1) {
  //       locations.push(work.jobs[job].location);
  //     }
  //   }

  //   // iterates through extra locations (an object I added in ResumeBuilder.js) and appends each location to
  //   // the locations array
  //   for (var place in extraLocations) {
  //     locations.push(extraLocations[place].location);
  //   }

  //   return locations;
  // }

// infoWindows are the little helper windows that open when you click
// or hover over a pin on a map. They usually contain more information
// about a location.
// Moved this from line 185 to change the scope to a global scope.  See comments on line 185 for explanation.
//var infoWindow = new google.maps.InfoWindow();


  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    //console.log(placeData.formatted_address);

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // I created the content variable to hold some info on the places I have lived or worked. 
    // getInfoWindowContent() is in resumeBuilder.js on line 328. 
    //var content = getInfoWindowContent(name);

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // creating an array of markers so I can set the visibility to false when searching.
    mapMarkers.push(marker);

    // This is where the infoWindow declaration was when I opened the file (it is now on line 157).  However, what I found is that when I clicked on
    // different map markers a new infoWindow would open, and the old infoWindow would stay open as well.  Google's API
    // states that only one infoWindow should be open at a time, and if you create one infoWindow object, then only one would be
    // open at one time. By moving the infoWindow creation outside of this function's definition, I created the infoWindow with
    // global scope, instead of a scope within this function.  This article helped me get there too:
    // http://stackoverflow.com/questions/1875596/have-just-one-infowindow-open-in-google-maps-api-v3
    // But this cool, I feel like between Google's API and the Stack Overflow article I actually understood what I was doing and the possible
    // ramifications of it all.  I have Udacity to thank for that.

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {
      // the search request object
      var request = {
        query: locations[place].mapLocationAddress()
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  //locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  //pinPoster(locations);
//}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
// window.addEventListener('load', initializeMap);
// // Vanilla JS way to listen for resizing of the window
// // and adjust map bounds
// window.addEventListener('resize', function(e) {
// //   Make sure the map bounds get updated on page resize
// map.fitBounds(mapBounds);
// });

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

// I am using a loop here, but I feel like there has to be a way to do this that costs less in terms
// of computer resources.
// TODO: Find out a way to do this without a loop.
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

// For this function, got some help at the google maps API and here:
// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
function stopMarkerAnimation(marker, timeout){
  setTimeout(function(){ 
    mapMarkers[marker].setAnimation(null); 
  }, timeout);
}
