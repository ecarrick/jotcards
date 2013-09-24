'use strict';
$(function(){
	JF.initialize({
			accessType: "full",
			
			appName: "JotCards"
	
	});
	
	$(".loginButton").on('click', function(e){
		e.preventDefault();
		JF.login(

			function success(){
				console.log("successful login");
					
				},

			function error(){
				window.alert("Could not authorize user");
			}
		); 
	});
	
	
});

var jc = {};