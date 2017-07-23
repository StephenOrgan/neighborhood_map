var map;
var currentInfoWindow = null;
var infoWindow;
// Create a new blank array for all the listing markers.
var markers = [];
var locations = [{
    id: "loc1",
    title: 'North Tea Lake',
    location: {
      lat: 45.940549,
      lng: -79.05746529999999
    }
  },
  {
    id: "loc2",
    title: 'Rain Lake',
    location: {
      lat: 45.6307057,
      lng: -78.9176213
    }
  },
  {
    id: "loc3",
    title: 'Canoe Lake',
    location: {
      lat: 45.5535,
      lng: -78.7171
    }
  },
  {
    id: "loc4",
    title: 'Daisy Lake',
    location: {
      lat: 45.655630,
      lng: -78.957200
    }
  },
  {
    id: "loc5",
    title: 'McRaney Lake',
    location: {
      lat: 45.5667159,
      lng: -78.9018784
    }
  },
  {
    id: "loc6",
    title: 'Rock Lake',
    location: {
      lat: 45.52510041970849,
      lng: -78.412
    }
  },
  {
    id: "loc7",
    title: 'Big Porcupine Lake',
    location: {
      lat: 45.4509,
      lng: -78.6214
    }
  },
  {
    id: "loc8",
    title: 'Louisa Lake',
    location: {
      lat: 45.4638547,
      lng: -78.5020475
    }
  },
  {
    id: "loc9",
    title: 'Ragged Lake',
    location: {
      lat: 45.4602896,
      lng: -78.655622
    }
  }
];

function initMap() {
  // Create a styles array to use with the map.
  var styles = [{
    featureType: 'water',
    stylers: [{
      color: '#19a0d8'
    }]
  }, {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [{
        color: '#ffffff'
      },
      {
        weight: 6
      }
    ]
  }, {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#e85113'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
        color: '#efe9e4'
      },
      {
        lightness: -40
      }
    ]
  }, {
    featureType: 'transit.station',
    stylers: [{
        weight: 9
      },
      {
        hue: '#e85113'
      }
    ]
  }, {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
      lightness: 100
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      lightness: -100
    }]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
        visibility: 'on'
      },
      {
        color: '#f0e4d3'
      }
    ]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#BCED91'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
        color: '#efe9e4'
      },
      {
        lightness: -25
      }
    ]
  }];

  // Constructor creates a new map - only center and zoom are required.
  var defaultIcon = makeMarkerIcon('FFFFFF');
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 45.7071591,
      lng: -78.6
    },
    zoom: 10,
    styles: styles,
    mapTypeControl: false
  });
  infoWindow = new google.maps.InfoWindow();
  appViewModel.fetchLakes();

}
 

function populateInfoWindow(marker, photos) {
  //flickr shit
  console.log(photos);
  len = photos.length;
  photo_content = '';
  photo_content += '<div class="slider-wrap"><div class="slider" data-slick=' + '\'{"slidesToShow": 1, "slidesToScroll": 1}\'>';

  for (var i = 0; i < len; i++) {
        var url = "https://farm" + photos[i].farm + ".staticflickr.com/" + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret + '_z.jpg';
        photo_content += '<div class="slide"><img class="flickr_photo" src=' + url + '></div>'
      }
  photo_content += '</div></div>';
  //photos.forEach.call.log(i)
  //
  infoWindow.setContent('<div>' + marker.title + '</div>' +  photo_content);
  infoWindow.open(map, marker);
  $(".slider").slick({
    slidesToShow: 1,
    speed: 1000,
    autoplay: true,
    dots: true,
    slidesToScroll: 10,
    autoplay: false,
    arrows:false
  });
  

}

function centerLocation(data, map) {
    position = data.position;
    var lng = data.lng();
    var lat = data.lat();
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(11);
  }

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}

//Knockout's View Model
var AppViewModel = function() {
  var self = this;

  self.lakes = ko.observableArray();
  self.filteredLakeList = ko.observableArray([]);




  function initialize() {
    fetchLakes();
  }

  //function to fetch lakes in Algonqin Park
  this.fetchLakes = function() {
    locations.forEach(function(lake) {
      lake = new Lake(lake, map);
      self.lakes.push(lake);
      self.filteredLakeList.push(lake);
    });
  };

  //function to filter lakes in Algonquin
  self.filterLakes = function() {
    self.filteredLakeList([]);
    
  };

  //function to handle clicks on the sidebar
  self.lakeClick = function(lake) {
    console.log("funtimes");
    new google.maps.event.trigger(lake.marker, 'click' );

  }
  
  self.enableDetails = function(lake) {
    //console.log(lake.marker);
   icon = makeMarkerIcon('eeaaaa');
   lake.marker.setIcon(icon);
  }

  self.disableDetails = function(lake) {
   icon = makeMarkerIcon('FFFFFF');
   lake.marker.setIcon(icon);
  }

  $('#search-str').keyup(function () {
    console.log(self.filteredLakeList());
    self.filteredLakeList([]);
    var len = self.lakes().length;
    var searchString = $('#search-str').val().toLowerCase();
    
    // Loop through each lake in the lake list
    for (var i = 0; i < len; i++) {
      // Get the current lake name 
      var lakeName = self.lakes()[i].title().toLowerCase();

      // If the name match the search string,
      // add the lake to the filtered lake list
      if (lakeName.indexOf(searchString) > -1) {
        var lat = self.lakes()[i].marker.position.lat();
        var lng = self.lakes()[i].marker.position.lng();
        var latlng = new google.maps.LatLng(lat, lng);
        self.filteredLakeList.push(self.lakes()[i]);
        // Set the map property of the marker to the map
        self.lakes()[i].marker.setMap(map);
        centerLocation(latlng, self.lakes()[i].marker.map);

      } else {
        // Set the map property of the marker to null so it won't be visible
        self.lakes()[i].marker.setMap(null);
      }
    }
  });
  

  

//end of AppViewModel
};



//Lake Model
var Lake = function(lake, map) {
  var defaultIcon = makeMarkerIcon('FFFFFF');
  var highlightedIcon = makeMarkerIcon('eeaaaa');
  var self = this;
  //self.photos = ko.observableArray();
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
    title: lake.title,
    icon: defaultIcon
  });

  //change icons on mouseover and mouseout
  self.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  self.marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
  });

  self.marker.addListener('click', function(e) {
    self.photos = [];
    var latLng = e.latLng;
    getFlickr(latLng, self.marker);
    populateInfoWindow(this, self.photos);
    centerLocation(latLng, self.marker.map);
  });



  
 //GET FlickrJSON
  
  function getFlickr(latlong, marker) {
    var lat = latlong.lat();
    var lng = latlong.lng();
    var api_key = 'b247ddd8d2a52c3451fc07632ae89b14';
    var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key + "&lat=" + lat + "&lon=" + lng + "&per_page=10&page=1&sort=radius=2&tags=algonquin&radius_units=km&format=json&nojsoncallback=1";

    $.getJSON(flickrUrl, function(data) {
    })
    .fail(function(e){
        console.log(e);
    })
    .done(function(photoarray) {
      data = photoarray.photos.photo;
      len = photoarray.photos.photo.length;

      
      for (var i = 0; i < len; i++) {
        self.photos[i]= data[i];
      }
      populateInfoWindow(marker, self.photos);
    });
  }
//end
};





var appViewModel = new AppViewModel();

ko.applyBindings(appViewModel);