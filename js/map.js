var map;
var infowindow;
var hops;

// google maps function 
function myMap() {
    var Swamy = {
        lat: 17.0053,
        lng: 81.7785
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: Swamy ,
        mapTypeControl: false
    });

    infowindow = new google.maps.InfoWindow();

    hops = new google.maps.LatLngBounds();
   
    ko.applyBindings(new MapModel());
}



/* My MapModel function */
var MapModel = function() {
    var self = this;

    this.searchplace = ko.observable('');

    this.total = ko.observableArray([]);

    // add location markers for each location
    markers.forEach(function(location) {
        self.total.push( new LocationMarker(location) );
    });

    // locations viewed on map
    this.locationList = ko.computed(function() {
        var Filterbar = self.searchplace().toLowerCase();
        if (Filterbar) {
            return ko.utils.arrayFilter(self.total(), function(location) {
                var str = location.myplace.toLowerCase();
                var result = str.includes(Filterbar);
                location.visible(result);
				return result;
			});
        }
        self.total().forEach(function(location) {
            location.visible(true);
        });
        return self.total();
    }, self);
};

// This function shows the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and show based
// on that markers position.
function showInfoWindow(marker, street, city, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        var windowContent = '<h4>' + marker.myplace + '</h4>' + 
            '<p>' + street + "<br>" + city + '<br>' + "</p>";

        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        var getmystreetview = function (value, update) {
            if (update == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = value.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent(windowContent + '<div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 2
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent(windowContent + '<div style="color: blue">No Street View Found</div>');
            }
        };
        streetViewService.getPanoramaByLocation(marker.position, radius, getmystreetview);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

function Bouncing(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1000);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
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
// it  handle map error
function mapError() {
    alert('An error occurred with Maps');
}