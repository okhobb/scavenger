
// Return the current position session variable to the currentPositionDiv.
Template.currentPositionDiv.currentPosition = function() {
    return Session.get('currentPosition');
};

// Return the current closest point session variable.
Template.currentPositionDiv.currentClosetPoint = function() {
    return Session.get('currentClosetPoint');
};

var winningDistanceThreshold = .0001;
var clueNumber = 0;

// The array of scavenger hunt points.
var winningPoints = [
    
    {
	name: 'brown alum hall',
	position: {
	    lat: 41.8295175,
	    lng: -71.4022052
	    clue: "This is where hackathon is at"
	}
    },

    {
	name: 'dmitris house',
	position: {
	    lat: 40.7189750,
            lng: -73.9561360
	    clue: "We have no idea clues for dmitris house, sorry"
	}   
    }
];

var distance = function(pos1, pos2) {
    Session.set('currentDistance', Math.sqrt(
	((pos1.lat - pos2.lat) * (pos1.lat - pos2.lat))
	    + ((pos1.lng - pos2.lng) * (pos1.lng - pos2.lng))
    ));
};

var getDistance = function(){
	return Session.get('currentDistance');
}

//this is what i added. not sure if it works yet
var updateDistance = function(clueNum){
	var curr = Session.get('currentPosition');
	Session.set('lastDistance', Session.get('currentDistance'));
	var d = distance(winningPoints[clueNum].position, curr);
}

var isCloser = function(){
	return Session.get('currentDistance')<Session.get('lastDistance');
}

// Check to see if you won.
/*var checkWin = function() {
    
    var curr = Session.get('currentPosition');
    var closestPointDist = undefined;
    var closestPoint = undefined;

    for (var i = 0; i < winningPoints.length; i++) {
	
	var d = distance(winningPoints[i].position, curr);

	if (closestPoint == undefined || closestPointDist > d) {
	    closestPoint = winningPoints[i];
	}

    }
    
    Session.set('currentClosetPoint', closestPoint);

};
*/

var checkWin = function(clueNum) {
    console.log("checking");
    var curr = Session.get('currentPosition');
    var closestPointDist = undefined;
    var closestPoint = undefined;


	var d = distance(winningPoints[clueNum].position, curr);
	updateDistance(clueNum);

	Session.set('distance', d);

	var correct = (Session.get('distance')<=winningDistanceThreshold);
	if(correct && clue<winningPoints.length-1){
		clueNumber++;
	}
};

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

	checkWin(clueNumber);
    };
    
    var error = function(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    navigator.geolocation.getCurrentPosition(success, error, options);

}, 5000);
