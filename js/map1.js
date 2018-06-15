/* Location Model */ 
var LocationMarker = function(value) {
    var self = this;

    this.myplace = value.myplace;
    this.position = value.location;
    this.street = '',
    this.city = '',

    this.visible = ko.observable();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('ECFA23');
    //  "highlighted location" marker color  when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FA23EC');

    var clientID = 'E5LDN4C1I1ZHR1ZG1ZZXKYZDFDQTOQAGF4AI2QME5MTBFYJH';
    var clientSecret = 'NBZDCAY3QEIGXTJCEEMIA5DBTRNAJYGO3A1ETQB12I5KUXO1';

    // get JSON request of foursquare data
    var URL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.myplace;
$.getJSON(URL).done(function(value) {
    var out = value.response.venues[0];
    self.street = out.location.formattedAddress[0] ? out.location.formattedAddress[0]: 'N/A';
    self.city = out.location.formattedAddress[1] ? out.location.formattedAddress[1]: 'N/A';
}).fail(function() {
    alert('Some  wrong with foursquare');
});

// Create a marker per location, and put into markers array
this.marker = new google.maps.Marker({
    position: this.position,
    myplace: this.myplace,
    animation: google.maps.Animation.DROP,
    icon: defaultIcon
});    

self.filterMarkers = ko.computed(function () {
    // set marker and extend bounds (showListings)
    if(self.visible() === true) {
        self.marker.setMap(map);
        hops.extend(self.marker.position);
        map.fitBounds(hops);
    } else {
        self.marker.setMap(null);
    }
});
this.marker.addListener('click', function() {
    showInfoWindow(this, self.street, self.city, infowindow);
    Bouncing(this);
    map.panTo(this.getPosition());
});
// creates bounce effect when item selected
this.bounce = function(place) {
    google.maps.event.trigger(self.marker, 'click');
};
// Two event listeners created are -  mouseover,  mouseout,
// to change the colors back and forth.
this.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
});
this.marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
});

// show item info when selected from list
this.show = function(location) {
    google.maps.event.trigger(self.marker, 'click');

    
};
};