'use strict';
var jc = {};
jc.formid = '';
jc.sets = [];
jc.apikey = '';
jc.newCards = 0;
jc.$main = $("#content");
jc.otherSide = "back";

jc.init = function(ready){
	console.log("init");
	if(!ready){
		jc.createBaseForm();
	} else{
		console.log(jc.formid);
		jc.showMainPage();
		jc.removeE(".loginButton");
	}


};

jc.removeE = function(e){
		var $e = $(e);
		$e.off();
		$e.remove();
};

jc.showHomePage = function(homeid){
	console.log("showHomePage");
	var container = "#"+homeid;
	
	var rendered = _.template($(container).html());
	jc.$main.html(
		rendered
	);

};

jc.showMainPage = function(){
	JF.getFormSubmissions(jc.formid, function(response){
		//console.log(response);
		jc.sets = response;
		if(response[0].answers){
			var page = _.template($("#mainPage").html(), {sets: response} );
		} else{
			var noCards = [{
							answers:{"1":{answer: "No cards yet!"}},
							id: "0"
						  }];
				console.log(noCards);
			var page = _.template($("#mainPage").html(), {sets: noCards} );
		}
		
		jc.$main.html( page );
		
		$("#createSet").on('click', function(){
			jc.removeE("#mainPageContent");
			jc.showCreatePage();
		});
		
		$(".cardSetBtn").on('click' , function(e){
			e.preventDefault();
			var setid = $(this).attr('set-id');
			jc.showSetPage(setid);
		});
		$(".cardSetDel").on('click' , function(e){
			e.preventDefault();
			var setid = $(this).attr('set-id');
			jc.deleteSet(setid);
		});
		
	});
};

jc.showCreatePage = function(){
	var template = _.template( $("#createPage").html() );
	
	jc.$main.html( template );
	
	jc.newCard();
	
	$("#addCardBtn").on('click', function(e){
		e.preventDefault();
		jc.newCard();
	});
	
	$("#cancelCreate").on('click', function(e){
		e.preventDefault();
		jc.removeE("#createPageContent");
		jc.showMainPage();
	
	});
	
	
	$("#addCardSubmit").on('click', function(e){
		e.preventDefault();
		var cardSet = {};
		
		cardSet.name	= $("#setName").text();
		cardSet.desc  	= $("#setDesc").text();
		cardSet.cards  	= '';
		var cards = [];
		$("#card_list").children().each( function( key, card ){
//			console.log( $(" .left ", this).val() + " : " + $(" .right ", this).val());
				var card = {};
				card.left   = $(" .left ", this).text();
				card.right = $(" .right ", this).text();
				cards.push(card);
			
			
		
		});
		cardSet.cards = JSON.stringify(cards);
		
		jc.createSet(cardSet);
	});

};

jc.showSetPage = function(setid){
	var set = $.grep(jc.sets, function(e){ return e.id == setid});
	var data = set[0].answers
	console.log(data['1'].answer);
		console.log(data['2'].answer);
	console.log(data['3'].answer);

	var setCards	= $.parseJSON( data['3'].answer );
	
	var page = _.template(
							$('#setPage').html(), 
							{title: data['1'].answer,
							 desc: data['2'].answer,
							 cards: setCards}
							 );
	 jc.$main.html(page);
	 var cardW = $(window).width()*0.35;
	 $("ul#setContainer").simplecarousel({
                width:cardW,
                height:350,
                visible: 1,
                next: $('#NavRight'),
                prev: $('#NavLeft')
            });
			
	$("#cancelSet").on('click', function(e){
		e.preventDefault();
		
		jc.removeE("#setPageContent");
		jc.showMainPage();
	
	});
	
	$("#cardArea .well li").on('click', function(e){
			jc.showCard(jc.otherSide);
	
	});

};

jc.showCard = function(side){
	if(side == 'front'){
		$('.cardBack').fadeOut(1);
		$('.cardFront').fadeIn(200);
		jc.otherSide="back";
	}
	if(side == 'back'){
		$('.cardFront').fadeOut(1);
		$('.cardBack').fadeIn(200);
		jc.otherSide="front";
	}


};

jc.newCard = function(){
	$(".right").off();
	jc.newCards++;
	var newCard = _.template( $("#cardTpl").html(), {count: jc.newCards} );
	
	$("#card_list").append(newCard);
	if(jc.newCards == 1){
		$("#setName").focus();
	}else{
		var number = jc.newCards-1;
		$("[right-number='"+number+"']").focus();		
	}
	
	$(".right").on('keypress', function(e){
		if(e.which == 0){
			//e.preventDefualt();
			jc.newCard();
		};
	});
};

jc.deleteSet = function(setid){
	
	JF.deleteSubmission(setid, function(response){
		jc.removeE("#mainPageContent");
		jc.showMainPage();
	})

};

jc.createSet = function(cardSet){
	console.log('createSet');
	jc.newCards=0;
	var submission = {};
	
	submission['1'] = cardSet.name;
	submission['2'] = cardSet.desc;
	submission['3'] = cardSet.cards;
	
	JF.createFormSubmission(jc.formid, submission, function(response){
		console.log(response);
		
		jc.removeE("#createPageContent");
		
		jc.showMainPage();
	});

};

jc.checkForm = function(){
	console.log("checkForm");
	JF.getForms(function(response){
		//console.log(response);
		/**
		 successful response including user forms array
		 *
		 */
		var isForm = false;

		$.each(response, function( key, value){
			//console.log(response[key].title+" : "+response[key].status);
				if( response[key].title == 'JotCardBackendForm' && response[key].status == "ENABLED" ){
					isForm = true;
					jc.formid = response[key].id;
					//console.log(isForm);
				}
		});
		jc.init(isForm);

	 });
};


jc.createBaseForm = function(){
	console.log("createBaseForm");
	var form = new Object();
	form.questions = new Object();
	form.properties = new Object();
	
	form.properties['title'] = "JotCardBackendForm";
	
	form.questions['1'] = new Object();
	form.questions['1']['type'] = 'control_textbox';
	form.questions['1']['text'] = 'name';
	form.questions['1']['order']= '1';
	form.questions['1']['name'] = 'setTitle';
	
	form.questions['2'] = new Object();
	form.questions['2']['type'] = 'control_textarea';
	form.questions['2']['text'] = 'desc';
	form.questions['2']['order']= '2';
	form.questions['2']['name'] = 'setDesc';
	
	form.questions['3'] = new Object();
	form.questions['3']['type'] = 'control_textarea';
	form.questions['3']['text'] = 'data';
	form.questions['3']['order']= '3';
	form.questions['3']['name'] = 'setData';
	
	console.log(form);
	
 	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "http://api.jotform.com/user/forms?apiKey="+jc.apikey,  
	  data: {"properties[title]"	:	"JotCardBackendForm",
			 "questions[1][type]"	: 'control_textbox',
			 "questions[1][text]"	: 'name',
			 "questions[1][order]"	: '1',
			 "questions[1][name]"	: 'setTitle',
			 "questions[2][type]"	: 'control_textarea',
			 "questions[2][text]"	: 'desc',
			 "questions[2][order]"	: '2',
			 "questions[2][name]"	: 'setDesc',
			 "questions[3][type]"	: 'control_textarea',
			 "questions[3][text]"	: 'data',
			 "questions[3][order]"	: '3',
			 "questions[3][name]"	: 'setData'
			}, 
	  success: function(response) { 
		console.log(response);
		 jc.formid = response.id;
	  }
	}
	);
	
};
