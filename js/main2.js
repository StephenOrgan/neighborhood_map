var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
// Create a styles array to use with the map.
	var styles = [
    	{
        	featureType: 'water',
            stylers: [
              { color: '#19a0d8' }]
        },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }]
        },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }]
        },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }]
        },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }]
        },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }]
        },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }]
        },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }]
        },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }]
        },{
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#adff2f'}]
        },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }]
    	}
	];

// Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 45.8371591, lng: -78.3791239},
  zoom: 10,
  styles: styles,
  mapTypeControl: false
  });

  ko.applyBindings(new AppViewModel());
}


//Knockout's View Model
var AppViewModel = function () {
  var self = this;
  // These are the lakes in the park that will be shown to the user.
  var locations = [
    {title: 'North Tea Lake', location: {lat: 45.940549, lng: -79.05746529999999}},
    {title: 'Rain Lake', location: {lat: 45.6307057, lng: -78.9176213}},
    {title: 'McRaney Lake', location: {lat: 45.5667159, lng: -78.9018784}},
    {title: 'Rock Lake', location: {lat: 45.52510041970849, lng: -78.412}},
    {title: 'Louisa Lake', location: {lat: 45.4638547, lng: -78.5020475}},
    {title: 'Ragged Lake', location: {lat: 45.4602896, lng: -78.655622}}
    ];


  function initialize() {
     fetchLakes();
  }

  //function to fetch cafes in New Delhi
  function fetchLakes() {
    locations.forEach(function(lake){
      lake = new Lake(lake, map);
      self.locations.push(lake);
    });
  };

//Lake Model
var Lake = function (lake, map) {
  var self = this;
  var defaultIcon = makeMarkerIcon('eeaaaa');
  self.name = ko.observable(cafe.name);
  self.location = lake.location;
  self.lat = self.location.lat;
  self.lng = self.location.lng;
  return new google.maps.LatLng(self.lat, self.lng);
  self.formattedAddress = ko.observable(self.location.formattedAddress);
  self.formattedPhone = ko.observable(cafe.contact.formattedPhone);
  self.marker = (function (lake) {
    var marker;
    if (cafe.map_location()) {
      marker = new google.maps.Marker({
      position: lake.map_location(),
                map: map,
                icon: defaultIcon
      });
    }
    return marker;
    })(self);
    self.formattedInfoWindowData = function () {
        return '<div class="info-window-content">' +
            '<span class="info-window-header"><h4>' + (self.name()===undefined?'Lake name not available':self.name()) +
            '</div>';
    };
};
