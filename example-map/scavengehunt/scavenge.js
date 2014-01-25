var _map = undefined;

People = new Meteor.Collection('people');

var geocodeAddress = function(data, onSuccess)
{
    var geocoder = new google.maps.Geocoder();

    if (geocoder) {
	geocoder.geocode({ 'address': data.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
		var loc = {
		    lat : results[0].geometry.location.lat(),
		    lng : results[0].geometry.location.lng()
		};
		data.location = loc;
		onSuccess(data);
            }
            else {
		console.error('Geocoding failed: ' + status);
            }
	});
    } 
    else
	console.error('Failed to make geocoder.');
};

var addMarkerAndCenterMap = function(geocodedData)
{
    if (geocodedData.location) {
	var pnt = new google.maps.LatLng(geocodedData.location.lat, geocodedData.location.lng);
	_map.setCenter(pnt);
	var marker = new google.maps.Marker({
	    'map' : _map,
	    'position' : pnt
	});
    }
};

var getInfoWindowHtml = function(geocodedData)
{
    var div =
	'<div>' 
	+ geocodedData.name + ', '
	+ geocodedData.address
	+ ', <button class="btn theyreOkButton" data-id="' + geocodedData._id + '">Theyre Ok</button>'
	+ '</div>';
    return div;
};

var addMarker = function(geocodedData)
{
    if (geocodedData.location) {
	var pnt = new google.maps.LatLng(geocodedData.location.lat, geocodedData.location.lng);
	var marker = new google.maps.Marker({
	    'map' : _map,
	    'position' : pnt
	});
	var infoBoxHtml = getInfoWindowHtml(geocodedData);
	google.maps.event.addListener(marker, 'click', function() {
	    var infoWindowOpts = {
		'content' : infoBoxHtml
	    };
	    var infoWindow = new google.maps.InfoWindow(infoWindowOpts);
	    infoWindow.open(_map, marker);
	});
    }
};

Meteor.methods({

    addPerson : function(data) {
	data.lastCheckinTimeMillis = 0;
        People.insert(
	    data,
            function(error, id) {
                //console.log('client called back: ' + error + ', ' + JSON.stringify(id));
            });
	return data;
    },

    theyreOk : function(data) {
	People.update(
	    { '_id' : data.id },
            { $set : { lastCheckinTimeMillis : new Date().getTime() } },
            { multi : false }
	);
    }
});

if (Meteor.isClient) {

    //var peopleQuery = 

    var initMap = function()
    {
	var initLat = 40.7189750;
        var initLng = -73.9561360
	var initZoom = 13;
        var mapOptions = {
            center: new google.maps.LatLng(initLat, initLng),
            zoom: initZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        _map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);

    };

    var addGrampsFormSubmitter = function()
    {
	var name = $('#addGrampsFormName').val();
	var address = $('#addGrampsFormWhere').val();
	var data = {
	    'name' : name,
	    'address' : address
	};
	geocodeAddress(
	    data,
	    function(geocodedData) {
		Meteor.call('addPerson', geocodedData);
		addMarkerAndCenterMap(geocodedData);
	    }
	);
    };

    var initUi = function()
    {
	$(document)
	    .on(
		'click', '.addGrampsFormSubmit', {},
		function(e) {
		    //console.log('adding');
		    addGrampsFormSubmitter();
		})
	    .on(
		'click', '.theyreOkButton', {},
		function(e) {
		    var id = $(e.srcElement).data('id');
		    Meteor.call('theyreOk', { 'id' : id });
		});

	initMap();
    };

    Template.people.listPeople = function()
    {
	People.find({}, { sort : { lastCheckinTimeMillis : 1 } }).forEach(
	    function(val) {
		//console.log('got a ' + val);
		addMarker(val);
	    }
	);

        return People.find({}, { sort : { lastCheckinTimeMillis : 1 } });
    };
    
    Meteor.startup(initUi);
}

