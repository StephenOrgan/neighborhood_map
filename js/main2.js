var map;
var currentInfoWindow=null;
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

  appViewModel.fetchLakes();
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

  this.lakes = ko.observableArray();


  function initialize() {
     fetchLakes();
  }

  //function to fetch cafes in New Delhi
  this.fetchLakes = function() {
    locations.forEach(function(lake){
      lake = new Lake(lake, map);
      self.lakes.push(lake);
    });
  };
};


//Lake Model
var Lake = function (lake, map) {
  var highlightedIcon = makeMarkerIcon('FFFF24');
  var self = this;
  var defaultIcon = makeMarkerIcon('eeaaaa');
  self.title = ko.observable(lake.title);
  self.location = lake.location;
  self.lat = self.location.lat;
  self.lng = self.location.lng;
  //return new google.maps.LatLng(self.lat, self.lng);
  self.formattedAddress = ko.observable(self.location.formattedAddress);
 // self.formattedPhone = ko.observable(lake.contact.formattedPhone);
  self.marker = new google.maps.Marker({
      position: lake.location,
      map: map,
      title: self.location.name,
      icon: defaultIcon
      });

  // Create an onclick event to open the large infowindow at each marker.
  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addDomListener(window, 'load', function() {
    self.marker.addListener('click', function(e) {
      var latLng = e.latLng;
      populateInfoWindow(this, infowindow);
      centerLocation(latLng, self.marker.map);
    });
  });
  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  self.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  self.marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
  
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
    return markerImage;
  }
  function populateInfoWindow(marker, infowindow) {
    var infoWindowClosed = false;
    // Check to make sure the infowindow is not already opened on this marker.
    if (currentInfoWindow) {
        currentInfoWindow.close();
    }
    currentInfoWindow = infowindow;
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + lake.title + '</div>');
      console.log(currentInfoWindow);
      infowindow.open(map, marker);

      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        infoWindowClosed = true;
      });
     }
    }
  function centerLocation(data, map) {  
  position = data.position;
  var lng = data.lng();
  var lat = data.lat();
  map.setCenter(new google.maps.LatLng(lat, lng));
  map.setZoom(11);
  }
};

var appViewModel = new AppViewModel();

ko.applyBindings(appViewModel);