var mapPoints = [
  {
    location: 'Ormsby\'s Tavern',
    type: 'restaurant'
  },
  {
    location: 'Tap',
    type: 'restaurant'
  },
  {
    location: 'Rathbun\'s Steakhouse',
    type: 'restaurant'
  },
  {
    location: 'Houston\'s',
    type: 'restaurant'
  },
  {
    location: 'The Vortex',
    type: 'restaurant'
  },
  {
    location: 'Coke Museum',
    type: 'site'
  },
  {
    location: 'Atlanta Zoo',
    type: 'site'
  },
  {
    location: 'Little Five Points',
    type: 'site'
  },
  {
    location: 'The Fox Theater',
    type: 'site'
  },
  {
    location: 'High Museum of Art',
    type: 'site'
  },
]

var MapPoint = function(data) {
  this.mapLocation = ko.observable(data.location);
  this.mapLocationType = ko.observable(data.type);
}

var ViewModel = function() {
  var self = this;

  this.mapPointsList = ko.observableArray([]);

  mapPoints.forEach(function(mapPoint){
    self.mapPointsList.push(new MapPoint(mapPoint));
  });
}

ko.applyBindings(new ViewModel());