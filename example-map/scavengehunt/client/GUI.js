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
}

    Meteor.startup(initUi);

