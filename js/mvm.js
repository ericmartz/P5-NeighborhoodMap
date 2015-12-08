// Messages displayed when there was a failure with the AJAX request
var FOURSQUARE_AJAX_FAILURE = 'Something went wrong with the Foursquare request.  No worries, the problem is most likely me, not you. You can always try again later.'
var FLICKR_AJAX_FAILURE = 'Something went wrong with the Flickr request.  No worries, the problem is most likely me, not you. You can always try again later.'

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
    note: 'If there is anything that says \'Atlanta\' then this is it. A wildly cool theater with an Egyptian ballroom and starry sky ceiling. Has a great history and fun place to tour.'
  },
  {
    location: 'High Museum of Art',
    address: '1280 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'site',
    latitude: 33.78916,
    longitude: -84.38494,
    note: 'A fine little museum in Atlanta. Not much compared to museums in Chicago, New York or Washington D.C., but a good place to visit if you live in Atlanta.'
  },
];

// I was a little unsure on this, but I see the individual MapPoints as my model.  
// Below, in the ViewModel I create a mapPointsList, which is an observableArray.
// I see the mapPointsList as an easy way to iterate through and keep track of the individual MapPoints.  
// So I think the mapPointsList should be part of the ViewModel.  I saw a post somewhere where 
// someone claimed it should be part of the model, but it did not make sense to me.  
// Anyway, thought I would leave my reasoning here for the reviewer to see how I reasoned this out.
var MapPoint = function(data) {
  this.mapLocation = ko.observable(data.location);
  this.mapLocationAddress = ko.observable(data.address);
  this.mapLocationType = ko.observable(data.type);
  this.mapLocationVisible = ko.observable(data.visible);
  this.mapLatitude = ko.observable(data.latitude);
  this.mapLongitude = ko.observable(data.longitude);
  this.mapNote = ko.observable(data.note);
  this.mapMarker = ko.observable();
};

var ViewModel = function() {
  var self = this;

  // KO Observable Array to hold MapPoints for search and displaying markers
  self.mapPointsList = ko.observableArray([]);

  // flickrPhotos is an observable array that updates the photos obtained from Flickr
  self.flickrPhotos = ko.observableArray([]);

  // shouldShowInfo is used to determine if the div's that display the AJAX info are visible.
  self.shouldShowInfo = ko.observable(false);

  // The following variables are used to update the view when a location is clicked.
  // Each observable holds data to display that is received from Foursquare
  self.rating = ko.observable();
  self.url = ko.observable();
  self.menu_url = ko.observable();
  self.phone_num = ko.observable();
  self.address = ko.observable();
  self.costEstimate = ko.observable();
  self.locationName = ko.observable();


  // Filling in the mapPointsList with data
  mapPoints.forEach(function(mapPoint){
    self.mapPointsList.push(new MapPoint(mapPoint));
  });

  // Adding markers to the map.  I am returning the marker to the mapPointsList so it can be used in the ViewModel
  for(var i = 0; i < self.mapPointsList().length; i++){
    self.mapPointsList()[i].mapMarker(addMapMarkers(self.mapPointsList()[i]));
  }

  for(i = 0; i < self.mapPointsList().length; i++){
    createInfoWindow(self.mapPointsList()[i]);
  }

  // query holds the value of the filter text field
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

  // Marker visibility is a computed function that listens to the search observable array and adds markers back
  // to the map as the location is added to the search observable array.
  self.markerVisibility = ko.computed(function(){
    for(var i = 0; i < self.search().length; i++) {
      // I could set the marker to visible here, but I thought I would pass that off to another function
      // Could be re-usable.  
      toggleMarkerVisible(self.search()[i].mapMarker());
    }
  });

  // clickedLocation is used to control what actions are taken when the user clicks on one of the locations.
  self.clickedLocation = function(location){
    // First make div's showing AJAX info visible.
    self.shouldShowInfo(true);
    // I animate the marker to draw attention to it once clicked.
    animateMarker(location.mapMarker());
    // console.log(location.mapMarker());
    // google.maps.event.trigger(location.mapMarker(), 'click');
    // I have to perform an ajax request to figure out what the venue ID is and get some basic info.
    getFoursquareInfo(location).done(function(response){
      // I tend to wonder if I should dump the following code off onto another function, or several functions.
      self.locationName(response.response.venues[0].name);

      self.url(response.response.venues[0].url || 'This location does not have a website');
      self.menu_url(response.response.venues[0].menu ? response.response.venues[0].menu.url : 'This location does not have a menu' );
      self.phone_num(response.response.venues[0].contact.formattedPhone || 'This location does not have a phone');
      self.address(response.response.venues[0].location.formattedAddress);

      //Then I use the venue ID to get detailed info concerning the venue.  Mostly, I just wanted the rating.
      getFoursquareDetail(response.response.venues[0].id).done(function(response){
        self.costEstimate(response.response.venue.price ? response.response.venue.price.message : 'This location does not have a price estimate');
        self.rating(response.response.venue.rating || 'This location does not have a rating');
      }).fail(function(e){
         window.alert(FOURSQUARE_AJAX_FAILURE);
      });
    }).fail(function(e){
      window.alert(FOURSQUARE_AJAX_FAILURE);
    });

    // Finally I send off a request to get a list of pictures from Flickr
    getFlickrInfo(location).done(function(response){
      var photoArray = response.photos.photo;
      var photo;

      // Then I remove any photos already displayed on the page
      self.flickrPhotos.removeAll();

      // Then I use the picture info obtained in the previous request to get specific info on the 
      // pictures.  Then I use that specific info to build an array of pictures.  
      for(var i=0; i < photoArray.length; i++){
        getFlickrPhotoURL(photoArray[i].id).done(function(response){
          photo = {
            photoURL : response.sizes.size[4].source
          };
          self.flickrPhotos.push(photo || 'No photo available');
        }).fail(function(){
          window.alert(FLICKR_AJAX_FAILURE);
        });
      }
    }).fail(function(){
      window.alert(FLICKR_AJAX_FAILURE);
    });
  };
};