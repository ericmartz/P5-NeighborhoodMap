var mapPoints = [
  {
    location: 'Ormsby\'s Tavern',
    address: '1170 Howell Mill Rd, Atlanta, GA 30318, USA',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'Tap',
    address: '1180 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'Rathbun\'s Steakhouse',
    address: '154 Krog St NE #200, Atlanta, GA 30307, USA',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'Houston\'s',
    address: '2166 Peachtree St NW, Atlanta, GA 30309, USA',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'The Vortex',
    address: '878 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'World of Coca Cola',
    address: '121 Baker St NW, Atlanta, GA 30313, USA',
    type: 'site',
    visible: true
  },
  {
    location: 'Atlanta Zoo',
    address: '800 Cherokee Ave SE, Atlanta, GA 30315, USA',
    type: 'site',
    visible: true
  },
  {
    location: 'Little Five Points',
    address: 'Little Five Points, Atlanta, GA 30307, USA',
    type: 'site',
    visible: true
  },
  {
    location: 'The Fox Theater',
    address: '660 Peachtree St NE, Atlanta, GA 30308, USA', 
    type: 'site',
    visible: true
  },
  {
    location: 'High Museum of Art',
    address: '1280 Peachtree St NE, Atlanta, GA 30309, USA',
    type: 'site',
    visible: true
  },
]

var MapPoint = function(data) {
  this.mapLocation = ko.observable(data.location);
  this.mapLocationAddress = ko.observable(data.address);
  this.mapLocationType = ko.observable(data.type);
  this.mapLocationVisible = ko.observable(data.visible);
}

var ViewModel = function() {
  var self = this;

  this.mapPointsList = ko.observableArray([]);

  mapPoints.forEach(function(mapPoint){
    self.mapPointsList.push(new MapPoint(mapPoint));
  });

  pinPoster(this.mapPointsList());

  self.query = ko.observable('');

  // Utilized the following to help with this.  
  // https://discussions.udacity.com/t/search-box-list-filtering/17725/5
  // http://codepen.io/JohnMav/pen/OVEzWM/
  // Initially looked at this site: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/ 
  // but it is old and I think it does not work with modern knockout and jquery.  
  // Played with it on a site I built to get beers showing (inspired from the older site), and then incorporated it in this project.
  // I looked at this site and the code attached extensvely (http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
  // but the codepen by JohnMav seemed much clearer.  Also, while the info in the knockmeout site was good, it is also from 2011
  // I felt the returning the mapLocation (or whatever) if the indexOf is greater than 0 was a lot clearer and simpler than
  // ko.utils.stringStartsWith.  Especially when points out KO minified didn't have stringStartsWith.  Anyway, felt like I got a lot
  // of help from the interwebs with this one and wanted to document that.
  // Sorry if this citation is not in APA format.  :-)   
  self.search = ko.computed(function(){
    toggleMarkersInvisible();
    return ko.utils.arrayFilter(self.mapPointsList(), function(point){
      return point.mapLocation().toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });

  // So here's my understanding of how this works.
  // I created the toggleMarkersInvisible() so that when a search is performed, all markers are set to invisible.
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
  // Don't feel like i have the time to dive into this now, but i's worth keeping in mind.
  self.markerVisibility = ko.computed(function(){
    for(var i = 0; i < self.search().length; i++) {
      toggleMarkerVisible(self.search()[i].mapLocationAddress());
    }
  });
}

ko.applyBindings(new ViewModel());