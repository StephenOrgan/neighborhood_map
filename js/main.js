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

// Map error handler
function mappingErrorhandler() {
    alert("Could not load Google Maps");
}

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
    var windowWidth = $(window).width();
    var zoom_set = 10

    if (windowWidth<=767) {
        zoom_set = 9;
        $('#search').css("display", "visible");
    } else if(windowWidth >=1080 && windowWidth <=1440) {
        zoom_set = 10;
    } else if(windowWidth >= 1441) {
        zoom_set = 10;
    }
    
    if(windowWidth >=768){
        $('#search').css("display", "visible");
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 45.7733167,
            lng: -78.682062
        },
        zoom: zoom_set,
        styles: styles,
        mapTypeControl: false
    });
    infoWindow = new google.maps.InfoWindow();
    appViewModel.fetchLakes();

}

 
//Reset map on click handler and
    //when window resize conditionals are met
function resetMap(latitude, longitude) {
    var windowWidth = $(window).width();
    var lat = 45.7733167;
    var lng = -78.682062;

    if (latitude && longitude) {
        lat = latitude
        lng = longitude
    }

    if(windowWidth <=1079) {
        map.setZoom(9);
        map.setCenter({
            lat: lat,
            lng: lng
        });
        $('#search').css("display", "visible");
    } else if(windowWidth >=1080 && windowWidth <=1440) {
        map.setZoom(10);
        map.setCenter({
            lat: lat,
            lng: lng
        });
        $('#search').css("display", "visible");
    } else if(windowWidth > 1441) {
        map.setZoom(10);
        map.setCenter({
            lat: lat,
            lng: lng
        });   
        $('#search').css("display", "visible");
    }
}
$("#reset").click(function() {
    resetMap();
});
$(window).resize(function() {
    resetMap();
}); 


function populateInfoWindow(marker, photos) {
    //flickr shit
    console.log(photos);
    len = photos.length;
    photo_content = '<div class="flickr-error"></div>';
    photo_content += '<div class="slider-wrap"><div class="slider" data-slick=' + '\'{"slidesToShow": 1, "slidesToScroll": 1}\'>';

    for (var i = 0; i < len; i++) {
                var url = "https://farm" + photos[i].farm + ".staticflickr.com/" + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret + '_z.jpg';
                photo_content += '<div class="slide"><img class="flickr_photo" src=' + url + '></div>'
            }
    photo_content += '</div></div>';
    //photos.forEach.call.log(i)
    //
    infoWindow.setContent('<div class="marker-title">' + marker.title + '</div>' +  photo_content);
    infoWindow.open(map, marker);
    $(".slider").slick({
        slidesToShow: 1,
        centerMode: true,
        speed: 1000,
        autoplay: true,
        dots: true,
        slidesToScroll: 10,
        autoplay: false,
        arrows:true,
        responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '10px',
        autoplay: true,
        slidesToShow: 1,
        dots: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '10px',
        autoplay: true,
        dots: false,
        slidesToShow: 1
      }
    }
  ]
});   

}

// function to bounce the marker
function toggleBounce(marker) {
        
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
        
      }

//center and zoom around a lat and long
function centerLocation(data, map) {
        position = data.position;
        var lng = data.lng();
        var lat = data.lat();
        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(11);
    }

// function to make a google pin marker by giving it a colour
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
    self.search_query = ko.observable('');
    self.lakes = ko.observableArray();
    self.filteredLakeList = ko.observableArray([]);
    



    function initialize() {
        fetchLakes();
    }

    //function to fetch lakes in Algonqin Park and
    //push to lakes and filteredLakeList observable arrays.
    this.fetchLakes = function() {
        locations.forEach(function(lake) {
            lake = new Lake(lake, map);
            self.lakes.push(lake);
            self.filteredLakeList.push(lake);
        });
    };



    //function to handle clicks on the sidebar
    self.lakeClick = function(lake) {
        var windowWidth = $(window).width();
        console.log(lake);
        new google.maps.event.trigger(lake.marker, 'click' );
        toggleBounce(lake.marker);
        if(windowWidth <=1000) {
            $("#content").css("display", "none");
        }
    }
    
    //function to mouseovers element on sidebar
    self.enableDetails = function(lake) {
        //console.log(lake.marker);
     
        if (map.getBounds().contains(lake.marker.getPosition())) {
            // marker is within map bounds
        } else {
            resetMap(lake.lat, lake.lng);

        }
     infoWindow.close();
     toggleBounce(lake.marker);
     icon = makeMarkerIcon('eeaaaa');
     lake.marker.setIcon(icon);
     
    }

    //function to handle when mouse leaves element on sidebar
    self.disableDetails = function(lake) {
     icon = makeMarkerIcon('FFFFFF');
     lake.marker.setIcon(icon);
    }

    
    self.listOfMarkers = ko.computed(function () {
        var search_query = self.search_query().toLowerCase();
        return ko.utils.arrayFilter(self.lakes(), function (marker) {
            var condition = marker.title().toLowerCase().indexOf(search_query) >= 0;

            if (marker.marker) {
                //console.log(marker.marker);
                marker.marker.setVisible(condition);

            }
            return condition;
        });
    }, self); 

    

    $("#search_toggle").click(function () {
        $search_container = $(this);
        //getting the next element
        $content = $(".content");
        
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(500, function () {

        });
        
    });


};
//end of AppViewModel



//Lake Model (don't need kobservable)
var Lake = function(lake, map) {
    var defaultIcon = makeMarkerIcon('FFFFFF');
    var highlightedIcon = makeMarkerIcon('eeaaaa');
    var self = this;
    self.id = ko.observable(lake.id);
    self.title = ko.observable(lake.title);
    self.location = lake.location;
    self.lat = self.location.lat;
    self.lng = self.location.lng
    self.hover = ko.observable(false);
    self.marker = new google.maps.Marker({
        position: lake.location,
        map: map,
        title: lake.title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: lake.id
    });

    //change icons on mouseover and mouseout (use knockout bindings of these)
    self.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
        console.log(self.id())
        console.log(appViewModel.lakes()[self.id()])
        appViewModel.lakes()[self.id()].hover(true);

        //$('#'+this.id).css('background-color','teal');
        //$('#'+this.id).css('color','white');


    });
    self.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);

        $('#'+this.id).css('background-color','');
        $('#'+this.id).css('color','');
    });

    
    //main click listener that handles the infowindow 
    //and zoom
    self.marker.addListener('click', function(e) {
        self.photos = [];
        var latLng = this.position;
        getFlickr(latLng, self.marker);
        populateInfoWindow(this, self.photos);
        centerLocation(latLng, self.marker.map);
        toggleBounce(self.marker);
    });



    
    //GET FlickrJSON
    
    function getFlickr(latlong, marker) {
        var lat = latlong.lat();
        var lng = latlong.lng();
        var api_key = 'b247ddd8d2a52c3451fc07632ae89b14';
        var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
        flickrUrl += api_key + "&lat=" + lat + "&lon=" + lng;
        flickrUrl += "&per_page=10&page=1&sort=radius=2&tags=algonquin&radius_units=km&format=json&nojsoncallback=1";

        $.getJSON(flickrUrl, function(data) {
        })
        .fail(function(e){
            console.log(e);
            $('.flickr-error').text('Flickr failed to return images, please try again later');
            $('.slider-wrap').css('height','10vh')
            $('.slider-wrap').css('width','30vh')
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
    //end of Get FlickrJSON
};



var appViewModel = new AppViewModel();

ko.applyBindings(appViewModel);