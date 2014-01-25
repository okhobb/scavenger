var initUi = function()
{
    $(document)
    .on(
	'click', '.Hint', {},
	function(e) {
	    //console.log('adding');                                                                                                                                                                       
	    checkHint();
	    //
	})
    .on(
	'click', '.Target', {},
	function(e) {
	    checkWin();
	});
    //Session.set('currentClue', "my current clue")
}

    Meteor.startup(initUi);


Template.guiButtons.getClue = function() {
  //  return Session.get('currentHint').position.clue
    return Session.get('currentClue');
}