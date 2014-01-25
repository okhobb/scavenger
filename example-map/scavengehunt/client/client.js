
// Return the current position session variable to the currentPositionDiv.
Template.currentPositionDiv.currentPosition = function() {
    return Session.get('currentPosition');
};

// Return the current closest point session variable.
//Template.currentPositionDiv.currentClosetPoint = function() {
//  return Session.get('currentClosetPoint');
//};

Template.currentPositionDiv.currentClosetPointMeters = function() {
    return Session.get('currentClosetPointMeters');
};

Template.currentPositionDiv.currentClue = function(){
	return Session.get('currentClue');
}

winningDistanceThreshold = .1;
clueNumber = 0;

// The array of scavenger hunt points.
winningPoints = [
    
    {
	name: 'brown alum hall',
	position: {
	    lat: 41.8295175,
	    lng: -71.4022052,
	    clue: "This is where hackathon is"
	}
    },

    {
	name: 'dmitris house',
	position: {
	    lat: 40.7189750,
            lng: -73.9561360,
	    clue: "We have no idea clues for dmitris house, sorry"
	}   
    }
];

var distanceInMeters = function(pos1, pos2) {
    var pos1LatLng = new google.maps.LatLng(pos1.lat, pos1.lng);
    var pos2LatLng = new google.maps.LatLng(pos2.lat, pos2.lng);
    return google.maps.geometry.spherical.computeDistanceBetween(pos1LatLng, pos2LatLng);
};

var updateDistanceInMetersToWinningPoint = function(winningPtId) {
    var currentPosition = Session.get('currentPosition');
    var meters = distanceInMeters(winningPoints[winningPtId].position, currentPosition);
    Session.set('currentClosetPointMeters', meters);
};

// used for the hint button, will display current hint and update as you move along through check in points in hunt 
Session.set('currentHint', winningPoints[0]);

// if (success) {
//CurrentHint = Session.get(‘CurrentHiint’)
//  CurrentHint ++;
//Session.set(‘CurrentHint’, CurrentHint)       
//  }


var distance = function(pos1, pos2) {
   
    return Math.sqrt(
	((pos1.lat - pos2.lat) * (pos1.lat - pos2.lat))
	    + ((pos1.lng - pos2.lng) * (pos1.lng - pos2.lng))
    );
};

var getDistance = function(){
    return Session.get('currentDistance');
}

//this is what i added. not sure if it works yet
var updateDistance = function(clueNum){
    var curr = Session.get('currentPosition');
    Session.set('lastDistance', Session.get('currentDistance'));
    var d = distance(winningPoints[clueNum].position, curr);
    Session.set('currentDistance', d);
}

checkHint = function(){
 	updateDistance(clueNumber);
    if (Session.get('currentDistance')<Session.get('lastDistance')){
    	alert("You're getting warmer!");
    }
    else {
    	alert("You're getting colder!")
    }
}



// Check to see if you won.
checkWin = function() {
    updateDistance(clueNumber);
    var curr = Session.get('currentDistance');
    if(curr<=winningDistanceThreshold){
    	
    	if(clueNumber<winningPoints.length-1){
    		alert("Bingo, you're correct!");
    		clueNumber++;
    		/////////////LOOOK HEREEEEEEE//////////////
    		Session.set('currentClue', winningPoints[clueNumber].position.clue);
    	}
    	else
    		alert("Congratulations you've reached your final destination!");
    }
    else
    	alert("You're not there yet.");


};




var centerMapOnCurrentPosition = function() { 
    
    var currentPosition = Session.get('currentPosition');
    if (_map && _map.setCenter && currentPosition) {
	var pnt = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
	_map.setCenter(pnt);
    }
};

var setCurrentClue = function(){
	Session.set('currentClue', winningPoints[clueNumber].position.clue);
}

var _currentPositionMarker = undefined;

var setMarkerOnCurrentPosition = function() { 
    
    var currentPosition = Session.get('currentPosition');
    if (_map && _map.setCenter && currentPosition) {
    
	var pnt = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);

	// Create or update the current position marker.
	if (! _currentPositionMarker) {
	    _currentPositionMarker = new google.maps.Marker({
		'map' : _map,
		'position' : pnt
	    });
	} else {
	    _currentPositionMarker.setPosition(pnt);
	}
    }
};

// Run this when meteor is ready.
Meteor.startup(function() {

    // Run this whenever the Session variables inside the calculation change.
    // (in this case 'currentPosition').
    Deps.autorun(function() {
	centerMapOnCurrentPosition();
	setMarkerOnCurrentPosition();
    })
});

// Loop to update the current position.
Meteor.setInterval(function() {

    var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
    };

    var success = function(pos) {
	var crd = pos.coords;
	Session.set('currentPosition', { lat: crd.latitude, lng: crd.longitude });

	// TODO - put this in the hint function.
	updateDistanceInMetersToWinningPoint(0);
    };
    
    var error = function(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    navigator.geolocation.getCurrentPosition(success, error, options);

}, 500);

