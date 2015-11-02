var mapPoints = [
  {
    location: 'Ormsby\'s Tavern',
    address: '1170 Howell Mill Rd, Atlanta GA 30318',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'Tap',
    address: '1180 Peachtree St NE, Atlanta, GA 30309',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'Rathbun\'s Steakhouse',
    address: '154 Krog St NE #200, Atlanta, GA 30307',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'Houston\'s',
    address: '2166 Peachtree Road NW, Atlanta, GA 30309',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'The Vortex',
    address: '878 Peachtree St NE, Atlanta, GA 30309',
    type: 'restaurant',
    visible: true
  },
  {
    location: 'World of Coca Cola',
    address: '121 Baker St NW, Atlanta, GA 30313',
    type: 'site',
    visible: true
  },
  {
    location: 'Atlanta Zoo',
    address: '800 Cherokee Ave SE, Atlanta, GA 30315',
    type: 'site',
    visible: true
  },
  {
    location: 'Little Five Points',
    address: 'Little Five Points, Atlanta, GA',
    type: 'site',
    visible: true
  },
  {
    location: 'The Fox Theater',
    address: '660 Peachtree St NE, Atlanta, GA 30308',
    type: 'site',
    visible: true
  },
  {
    location: 'High Museum of Art',
    address: '1280 Peachtree St NE, Atlanta, GA 30309',
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

}

ko.applyBindings(new ViewModel());