// So I would rather use the geocoding to have an address and find the latitude/longitude,
// but I started out hardcoding the lat/long just because I thought it would be best to start simply.
var mapPoints = [
  {
    location: 'Ormsby\'s Tavern',
    address: '1170 Howell Mill Rd, Atlanta, GA 30318, USA',
    type: 'restaurant',
    latitude: 33.78597,
    longitude: -84.41202
  },
  {
    location: 'Tap',
    address: '1180 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'restaurant',
    latitude: 33.78686,
    longitude: -84.38378
  },
  {
    location: 'Rathbun\'s Steakhouse',
    address: '154 Krog St NE #200, Atlanta, GA 30307, USA',
    type: 'restaurant',
    latitude: 33.75892,
    longitude: -84.36408
  },
  {
    location: 'Houston\'s',
    address: '2166 Peachtree St NW, Atlanta, GA 30309, USA',
    type: 'restaurant',
    latitude: 33.81346,
    longitude: -84.39279
  },
  {
    location: 'The Vortex',
    address: '878 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'restaurant',
    latitude: 33.77883,
    longitude: -84.38451
  },
  {
    location: 'World of Coca Cola',
    address: '121 Baker St NW, Atlanta, GA 30313, USA',
    type: 'site',
    latitude: 33.76274,
    longitude: -84.39266
  },
  {
    location: 'Atlanta Zoo',
    address: '800 Cherokee Ave SE, Atlanta, GA 30315, USA',
    type: 'site',
    latitude: 33.73410,
    longitude: -84.37228
  },
  {
    location: 'Little Five Points',
    address: 'Little Five Points, Atlanta, GA 30307, USA',
    type: 'site',
    latitude: 33.76439,
    longitude: -84.34960
  },
  {
    location: 'The Fox Theater',
    address: '660 Peachtree St NE, Atlanta, GA 30308, USA', 
    type: 'site',
    latitude: 33.77262,
    longitude: -84.38556
  },
  {
    location: 'High Museum of Art',
    address: '1280 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'site',
    latitude: 33.78916,
    longitude: -84.38494
  },
]

// I was a little unsure on this, but I see the individual MapPoints as my model.  
// Below, in the ViewModel I create a mapPointsList, which is an observableArray.
// I see the mapPointsList as an easy way to iterate through and keep track of the individual MapPoints.  
// So I consider the mapPointsList hould be part of the ViewModel.  I saw a post somewhere that 
// someone claimed it should be part of the model, but it did not make sense to me.  
// Anyway, thought I would leave my reasoning here for the reviewr to see how I reasoned this out.
var MapPoint = function(data) {
  this.mapLocation = ko.observable(data.location);
  this.mapLocationAddress = ko.observable(data.address);
  this.mapLocationType = ko.observable(data.type);
  this.mapLocationVisible = ko.observable(data.visible);
  this.mapLatitude = ko.observable(data.latitude);
  this.mapLongitude = ko.observable(data.longitude);
}

var ViewModel = function() {
  var self = this;

  self.mapPointsList = ko.observableArray([]);

  mapPoints.forEach(function(mapPoint){
    self.mapPointsList.push(new MapPoint(mapPoint));
  });

  for(var i = 0; i < self.mapPointsList().length; i++){
    addMapMarkers(self.mapPointsList()[i]);
  }

  self.query = ko.observable('');

  // Utilized the following to help with this.  
  // https://discussions.udacity.com/t/search-box-list-filtering/17725/5
  // http://codepen.io/JohnMav/pen/OVEzWM/
  // Initially looked at this site: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/ 
  // but it is old and I think it does not work with modern knockout and jquery.  
  // Played with it on a site I built to get beers showing (inspired from the older site), and then incorporated it in this project.
  // I looked at this site and the code attached extensively (http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
  // but the codepen by JohnMav seemed much clearer.  Also, while the info in the knockmeout site was good, it is also from 2011
  // I felt the returning of mapLocation (or whatever) if the indexOf is greater than 0 was a lot clearer and simpler than
  // ko.utils.stringStartsWith.  Especially when KO minified didn't have stringStartsWith.  Anyway, felt like I got a lot
  // of help from the interwebs with this one and wanted to document that.
  // Sorry if this citation is not in APA format.  :-)   
  self.search = ko.computed(function(){
    toggleMarkersInvisible();
    return ko.utils.arrayFilter(self.mapPointsList(), function(point){
      return point.mapLocation().toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });

  // So here's my understanding of how this works.
  // I created toggleMarkersInvisible() so that when a search is performed, all markers are set to invisible.
  // Then, the markerVisibility computed is listening to the search() computed.  Every time search changes the computed runs
  // and looks through the search computed to see what is in it, and sends off the address of each item to 
  // toggleMarkerVisible.
  // Since everytime a button is pressed in search, the search computed changes and sets everything to invisible, and then
  // markerVisibility sees a change and runs and sets the appropriate mapPoints back to visible.  Makes it look like it is adding
  // back the markers as you delete letters, but really everything is constantly set to invisible and then re-added
  // Pretty stoked that I wrote this after just looking at how to set map markers to invisible 
  // and then looked at the KO documentation on computeds.
  // Although I do wonder what this is doing to memory.  With this small application, it won't cause any problems,
  // But it is looping through these arrays with every keypress.  
  // Don't feel like i have the time to dive into this now, but it's worth keeping in mind.
  self.markerVisibility = ko.computed(function(){
    for(var i = 0; i < self.search().length; i++) {
      toggleMarkerVisible(self.search()[i].mapLocation());
    }
  });

  self.markerAnimation = function(marker){
    animateMarker(marker.mapLocation());
  };
}

ko.applyBindings(new ViewModel());