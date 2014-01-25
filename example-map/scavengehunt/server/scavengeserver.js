

var geocodeAddress2 = function(address)
{
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=blah';
    var geocodeResult = Meteor.http.call('GET',	url);
    console.log('got ' + JSON.stringify(geocodeResult));
};
