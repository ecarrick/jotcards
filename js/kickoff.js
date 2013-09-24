'use strict';

$(function(){
	jc.showHomePage('homePage');

	JF.initialize({
			accessType: "full",
			
			appName: "JotCards"
	
	});
	
	$(".loginButton").on('click', function(e){
		e.preventDefault();
		JF.login(

			function success(){
				console.log("successful login");
				
				
				
				jc.apikey = JF.getAPIKey();
				jc.checkForm();
				
				
				
			},

			function error(){
				window.alert("Could not authorize user");
			}
		); 
		
	});
	

	
});

