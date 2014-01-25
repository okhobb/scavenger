var initUi = function()
{
    $(document)
    .on(
	'click', '.Hint', {},
	function(e) {
	    //console.log('adding');                                                                                                                                                                       
	    alert("my hint")
	})
    .on(
	'click', '.Target', {},
	function(e) {
	    alert("testing if I'm here")
	});
}

    Meteor.startup(initUi);