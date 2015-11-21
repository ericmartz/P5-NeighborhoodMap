// So I would rather use the geocoding to have an address and find the latitude/longitude,
// but I started out hardcoding the lat/long just because I thought it would be best to start simply.
var mapPoints = [
  {
    location: 'Ormsby\'s Tavern',
    address: '1170 Howell Mill Rd, Atlanta, GA 30318, USA',
    type: 'restaurant',
    latitude: 33.78597,
    longitude: -84.41202,
    note: 'This tavern has a great food, but also takes up two levels and has a great atmosphere. Plenty of games to play, including a bocce ball court. You\'ll notice in the picture there is just a wall with windows. An interesting thing about Ormsby\'s is that there is no sign or identification from the street. It is in the basement of a shopping center, and the sign at the door cannot be seen until you are right in front of Ormsby\'s.' 
  },
  {
    location: 'Tap',
    address: '1180 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'restaurant',
    latitude: 33.78686,
    longitude: -84.38378,
    note: 'A great restaurant with a great atmosphere and a fantastically varied beer list. While I would consider this a high end place, they also serve a choclate dip with their fries that is similar to a Wendy\'s Frosty.'
  },
  {
    location: 'Rathbun\'s Steakhouse',
    address: '154 Krog St NE #200, Atlanta, GA 30307, USA',
    type: 'restaurant',
    latitude: 33.75892,
    longitude: -84.36408,
    note: 'Never been here, but my brother in law used to work here. Supposed to be the best steakhouse in Atlanta. Apparently the judges of that have not eaten at my house.'
  },
  {
    location: 'Houston\'s',
    address: '2166 Peachtree St NW, Atlanta, GA 30309, USA',
    type: 'restaurant',
    latitude: 33.81346,
    longitude: -84.39279,
    note: 'While Houston\'s is a chain owned by a larger conglomerate, I have to say it is hands down the best burger I have ever tasted.'
  },
  {
    location: 'The Vortex',
    address: '878 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'restaurant',
    latitude: 33.77883,
    longitude: -84.38451,
    note: 'Often called the best burger place in Atlanta. Even though I consider myself a burger connissuer, I have not eaten at The Vortex. I doubt it will live up to my expectation, so I just have not tried.'
  },
  {
    location: 'World of Coca Cola',
    address: '121 Baker St NW, Atlanta, GA 30313, USA',
    type: 'site',
    latitude: 33.76274,
    longitude: -84.39266,
    note: 'A fun touristy place, next to the Georgia Aquarium (the Aquarium in Chattanooga, TN is better). At the Coke Museum you can try over 100 different drinks made by Coke.'
  },
  {
    location: 'Atlanta Zoo',
    address: '800 Cherokee Ave SE, Atlanta, GA 30315, USA',
    type: 'site',
    latitude: 33.73410,
    longitude: -84.37228,
    note: 'A good city zoo. They are very proud of their pandas. It is next to an interesting place called the Cyclorama. That is the largest single painting of the Civil War.'
  },
  {
    location: 'Little Five Points',
    address: 'Little Five Points, Atlanta, GA 30307, USA',
    type: 'site',
    latitude: 33.76439,
    longitude: -84.34960,
    note: 'I visited Little Five a lot in high school.  An eclectic place where you never know what you will find.  I highly recommend an afternoon there.'
  },
  {
    location: 'The Fox Theater',
    address: '660 Peachtree St NE, Atlanta, GA 30308, USA', 
    type: 'site',
    latitude: 33.77262,
    longitude: -84.38556,
    note: 'If there is anything that say \'Atlanta\' then this is it. A wildly cool theater with an Egyptian ballroom and starry sky ceiling. Has a great history and fun place to tour.'
  },
  {
    location: 'High Museum of Art',
    address: '1280 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'site',
    latitude: 33.78916,
    longitude: -84.38494,
    note: 'A fine little museum in Atlanta. Not much compared to museums in Chicago, New York or Washington D.C., but a good place to visit if you live in Atlanta.'
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
  this.mapNote = ko.observable(data.note);
  this.mapMarker = ko.observable();
}

var LocationInfo = function() {
  this.url = ko.observable();
}

var ViewModel = function() {
  var self = this;

  // KO Observable Array to hold MapPoints for search and displaying markers
  self.mapPointsList = ko.observableArray([]);

  self.url = ko.observable();

  mapPoints.forEach(function(mapPoint){
    self.mapPointsList.push(new MapPoint(mapPoint));
  });

  for(var i = 0; i < self.mapPointsList().length; i++){
    self.mapPointsList()[i].mapMarker(addMapMarkers(self.mapPointsList()[i]));
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
      toggleMarkerVisible(self.search()[i].mapMarker());
    }
  });

  self.clickedLocation = function(location){
    animateMarker(location.mapMarker());
    getLocationInfo(location).done(function(response){
      self.url(response.response.venues[0].url);
    });
  };
}

ko.applyBindings(new ViewModel());