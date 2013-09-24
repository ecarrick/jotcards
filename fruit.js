var debug = false;
var stuid = '';
var custid = '';
var newcustStuid = '';
var custStuid = '';
var delivDateid= '';
$(function() {
		// Menu Click Listeners
		// These start the requests to populate the respective pages with dynamic content.
	$("#userMenuItem").on("click", function(){listUsers();});
	$("#studentMenuItem").on("click", function(){listStudents('student');});
	$("#productsMenuItem").on("click", function(){listProducts();});
	$("#emailconfigMenuItem").on("click", function(){emailLoginFetch();});
	$("#delivdatesMenuItem").on("click", function(){delivDates(true);});
	$("#reportingMenuItem").on("click", function(){delivDates(true);});
	$("#orderMenuItem").on("click", function(){	listCustomers('order', true);});
	//$("#customerMenuItem").on("click", function(){listCustomers('customer', true);});

		// Static Button Listeners that are apart of the app, but are not populated through AJAX.
		// Listeners for buttons populated through AJAX should be located in the click_listener() function
			// Modal Buttons
	$("input#newcustomerSubmit").on("click", function(){createCustomer();});
	$("#emailCustomerSubmitBtn").on("click",function(){emailCustomerOrder();});
	$("input#emailUpdateSubmitBtn").on("click", function(){emailTemplateSave();});
	$("input#emailUpdateDeleteBtn").on("click", function(){emailTemplateDelete();});
	$("#emailCreateSubmitBtn").on("click",function(){emailTemplateCreate();});
			// Customers Page
	$("#addCustomerBtn").on("click", function(){addCustomer();});
	$("#oldOrdersBtn").on("click", function(){delivDates(true);});
	$("input#customerUpdate").on("click", function(){updateCustomer();});
			// Users Page
	$("#addUserBtn").on("click", function(){addUser();});
	$(".userPassBtn").on("click", function(){resetUser($(this).attr('id'));});
	$(".userDelBtn").on("click", function(){delUser($(this).attr('id'));});
			// Students Page
	$("#addStudentBtn").on("click", function(){addStudent();});
	$("input#studentDel").on("click", function(){delStudent(stuid);});
	$("input#studentsClear").on("click", function(){clearStudents();});
	$("input#studentsDelete").on("click", function(){deleteStudents();});
			// Delivery Dates Page
	$("#addDateBtn").on("click", function(){addDate();});
			// Products Page
	$("#updateProductBtn").on("click",function(){updateProduct($('input#productID').val());});
	$("#addProductBtn").on("click",function(){show_modal("productAddModal")});
	$("#productConfirmAddBtn").on("click",function(){createProduct();});
			// Email Config Page
	$("input#emailDefaultsSave").on("click",function(){updateTempateDefaults();});
	$("#emailConfigSave").on("click",function(){emailLoginSave();});
	$("#addEmailTemplateBtn").on("click",function(){show_modal("emailCreateModal");});
	
		// Listener for window resize; it reapplies the modal so that there are no gaps
	$(window).on("resize", function(){remake_modal();});
		// Tells jquery to parse all objects in these modals. Allows for the 'pretty' formatting
		// that jquery does.
	$("#emailCustomerArea").trigger('create');
	$("#emailCreateArea").trigger('create');
	$("#emailUpdateArea").trigger('create');
	
		// Delete Product Button that pulls up the confirmation modal
	$("#delProductBtn").on("click",function(){
		var prodID = $('input#productID').val();
		if(prodID == 0){
			update_msg("productsM", "A product needs to be selected in order to delete it.", true);
		}else{
			$("#productDeleteName").empty();
			$("#productDeleteName").append($("#productName").val());
			show_modal("delProductModal");
		}
	});
		// Listener for the confirm delete product
	$("#yesDeleteProduct").on("click",function(){deleteProduct($('input#productID').val());});
		
		// Delete Customer Button that checks to make sure a customer is selected and pulls up the confirmation
		// modal
	$("#customerDelete").on("click",function(){
		var name = $('input#customerFull').val();
		var id   = custid;
		if(id == 0){
			update_msg("customersM", "A customer needs to be selected in order to delete.", true);
		}else{
			$("#CusomterDeleteName").empty();
			$("#CusomterDeleteName").append(name);
			show_modal("delCustomerModal");
		}
	});
		// Listener for the confirm delete customer
	$("#yesDeleteCustomer").on("click",function(){deleteCustomer(custid);});

		// Nice little listener for a neat 'feature'
		// it auto creates the student fullname on the fly while you are still typing,
		// putting it in in the format: "FirstName LastName"
	$('input#addStudentLast').keyup(function(){
		var sF = $('input#addStudentFirst').val();
		var sL = $('input#addStudentLast').val();
		var sFull = sF+" "+sL;
		$('input#addStudentFull').val(sFull);
	});
	
	//if close button is clicked, hide the modal
    $('.window .close').on("click", function(e) {
        //Cancel the link behavior
        e.preventDefault();
        $('.mask, .window').hide();
    });    
    //if mask is clicked, hind the modal
    $('.mask').click(function () {
        $(this).hide();
        $('.window').hide();
    });
	
});
	// Passing the name of the modal DIV id, it will show the modal
	// mid must be the id of an existing modal div
function show_modal(mid){
	//Get the screen height and width
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();
	//Set height and width to mask to fill up the whole screen
	$('div#'+mid+' .mask').css({'width':maskWidth,'height':maskHeight});
	//transition effect    
	$('div#'+mid+' .mask').fadeIn(250);   
	$('div#'+mid+' .mask').fadeTo("fast",0.8); 
	//Get the window height and width
	var winH = $(window).height();
	var winW = $(window).width();
	//Set the popup window to center
	$('div#'+mid+' .dialog').css('top',  winH/5-$('div#'+mid+' .dialog').height()/5);
	$('div#'+mid+' .dialog').css('left', winW/2-$('div#'+mid+' .dialog').width()/2);
	//transition effect
	$('div#'+mid+' .dialog').fadeIn(500);
}
	// Remakes current modal mask if the modal is actually active
function remake_modal(){
	// Check to see if modal active
	if($('.mask').css('display') !== 'none'){
		var winH = $(document).height();
		var winW = $(window).width();
		//Set the popup window to center
		$('.mask').css('width',  winW);
		$('.mask').css('height', winH);
		$('.dialog').css('top',  winH/7) ;
		$('.dialog').css('left', winW/2-$('div#resetUserpwd .dialog').width()/2);
	}
}
	// The user interactive message function.
	// container- string; is the specific message DIV id that is on the page you want to display the error for
	// msg- string; is the message text
	// err- bool; Default for err is false, if true, then the message is an error message and make the background
	//			  red
	// temp- bool; default for temp is true, if true, the message will automatically fade away. If false, then the
	//			   message will display until the close button is clicked
function update_msg(container, msg, err, temp){
	err = typeof err !== 'undefined' ? err : false;
	temp = typeof temp !== 'undefined' ? temp : true;
	$("#"+container).empty();
	$("#"+container).fadeOut(100);
	if(err){
		$("#"+container).css('background-color', '#F00');
		$("#"+container).focus()
	}else{
		$("#"+container).css('background-color', '#51C951');
	}
	$("#"+container).append("<p>"+msg+".<span class='errClose'>Close</span></p>");
	$("#"+container).fadeIn(500);
	if(!err && temp){
		$("#"+container).delay(1000).fadeOut(800);
	}else if(err && temp){
		$("#"+container).delay(1000).fadeOut(800);
	}
	$('html, body').animate({ scrollTop: $("#"+container).offset().top }, 'slow');
	$('p .errClose').on("click", function(){
		//console.log($(this).parent().parent('div').attr('id'));
		close_msg($(this).parent().parent('div').attr('id'));
	});
}
	// Simple message close function, needs the id of the specific message container
function close_msg(container){
	$("#"+container).fadeOut(500);
}
	// Formats the orders for placing into an Email
	// Simple, each order in an array, then combine
	// the array with a new line after each row
function orderParser(orderObject){
	var orderLines = [];
	$.each(orderObject, function(key, order){
		var subtotal = Number(order.total);
		var subFormatted = "$"+subtotal.toFixed(2);
		orderLines.push(order.product+" - Number of boxes: "+order.quantity+" - Price per box: "+order.price+" - Subtotal: $"+subFormatted);
	});
	return orderLines.join('\n');
}
	// Replaces the template placeholders with their respective infomration
function templateFiller(intext, built){
	/* Here are the current placeholders
	Customer First Name:{{firstname}}
	Customer Last Name:{{lastname}}
	Customer Full Name:{{fullname}}
	Customer Email:{{customeremail}}
	Order Date:{{orderdate}}
	Order Details:{{orderdetails}}
	Order Total:{{ordertotal}}
	Customer Notes:{{customernotes}}*/
	if(debug==true){
		console.log(intext);
	}
	intext = intext.replace(/{{firstname}}/g, built.cinfo.first);
	intext = intext.replace(/{{lastname}}/g, built.cinfo.last);
	intext = intext.replace(/{{fullname}}/g, built.cinfo.full);
	intext = intext.replace(/{{customeremail}}/g, built.cinfo.email);
	intext = intext.replace(/{{orderdate}}/g, built.oinfo.date);
	intext = intext.replace(/{{orderdetails}}/g, orderParser(built.oinfo.orders));
	intext = intext.replace(/{{ordertotal}}/g, built.oinfo.total);
	intext = intext.replace(/{{customernotes}}/g, built.cinfo.notes);
	return intext;
}
	// Click listner function, called after dynamic content, e.g. buttons, are loaded through AJAX
	// Because the function is called multiple times, each listener is shut off, to make sure the buttons
	// do not respond more than once.
function click_listener(){
	$('.studentListdiv').off();
	$('#newcustomerStudent div.studentListdiv').off();
	$('#customerStudent div.studentListdiv').off();
	$('.customerListdiv').off();
	$('#customerOrders div.delivSelect').off();
	$("input#addOrderBtn").off();
	$("input#addOrderBtn").off();
	$("input#saveOrderBtn").off();
	$(".userPassBtn").off();
	$('#emailCustomerArea').off();
	$('.templateItem').off();
	$("#emailOrderBtn").off();
	
	$('.studentListdiv').on( "change", '#studentSelectstudent', function(event, ui) {
		stuid = $(this).attr('value');
		//console.log("Selected student: "+stuid);
	});
	$('#newcustomerStudent div.studentListdiv').on( "change", '#studentSelectorder', function(event, ui) {
		newcustStuid = $(this).attr('value');
		//console.log("Selected new customer student: "+newcustStuid);
	});
	$('#customerStudent div.studentListdiv').on( "change", '#studentSelectorder', function(event, ui) {
		custStuid = $(this).attr('value');
		//console.log("Selected customer student: "+custStuid);
	});
	$('.customerListdiv').on( "change", '#customerSelectorder', function(event, ui) {
		custid = $(this).attr('value');
		//console.log("Selected customer: "+custid);
		getCustInfo(custid);
	});
	$('#customerOrders div.delivSelect').on( "change", '#delivSelect', function(event, ui) {
		delivDateid = $(this).attr('value');
		buildCustOrders(custid, delivDateid);
		//console.log("Selected delivery date: "+delivDateid);
	});
	$('#emailCustomerArea').on( "change", 'select#emailCustomerTemplate', function(event, ui) {
		emailOrderBuild()
		//console.log("Selected delivery date: "+delivDateid);
	});
		// Order Manipulation Buttons
	$("input#addOrderBtn").on("click", function(){addOrderRow();});
	$("input#saveOrderBtn").on("click", function(){saveOrderRow();});

	$('.productItem').on("click", function(){productInformation($(this).attr('prodID'))});
	$('.templateItem').on("click", function(){show_modal("emailUpdateModal"); emailTemplateFetch($(this).attr('templateID'))});
	$(".userPassBtn").on("click", function(){resetUser($(this).attr('id'));});
	$(".userDelBtn").on("click", function(){delUser($(this).attr('id'));});
	$("#emailOrderBtn").on("click", function(){
		emailOrderTemplates();
		show_modal("emailCustomerModal");
	});

		//if close button is clicked
    $('.window .close').on("click", function(e) {
        //Cancel the link behavior
        e.preventDefault();
        $('.mask, .window').hide();
    });    
     
    //if mask is clicked
    $('.mask').click(function () {
        $(this).hide();
        $('.window').hide();
    });
}
function deleteCustomer(id){
	var action = 'delCustomer';
	if(debug==true){
		console.log("Action:  "+action);	}
 	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/customerManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 cid: id
			}, 
	  success: function(customerDelResults) { 
		if(customerDelResults.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(customerDelResults.newIdentifi){
			if(debug==true){
				console.log(customerDelResults);
			}
			verifyIdentifi = customerDelResults.newIdentifi;
			listCustomers("order");
			$('.mask, .window').fadeOut(200);
				update_msg("customersM", customerDelResults.r, customerDelResults.fail, true);
			$('[id^="customer"]').val('');
			$('select[id^="customer"]').prop('selectedIndex',0);
			$('input[id^="customerWant"]').removeAttr('checked');
			$("div#idHolder p.id").empty();
			custid = '';
			$('div#orderWindow').fadeOut(100)
			$('div#orderWindow').empty();
			action='';
			click_listener();
		}
	}
	});
}
function emailCustomerOrder(){
	action="emailCustomer";
	if(debug==true){
		console.log("Action:  "+action);	}
	var email = {};
	email["addr"] = $("#emailCustomerTo").val();
	email["sub"] = $("#emailCustomerSubject").val();
	email["body"] = $("#emailCustomerBody").val();
	email["name"] = $('input#customerFirst').val() + $('input#customerLast').val();
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 email: email
			}, 
	  success: function(emailed) {
		if(emailed.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(emailed.newIdentifi){
			if(debug==true){
				console.log(emailed);
			}
			verifyIdentifi = emailed.newIdentifi;
			action='';
			if(emailed.fail==false){
				update_msg("customersM", emailed.r, emailed.fail);
				$('.mask, .window').fadeOut(200);
			} else if(emailed.fail==true){
				update_msg("customersM", emailed.r, emailed.fail);
				$('.mask, .window').fadeOut(200);
				show_modal("emailCustomerModal");
			}
		}
		}
	  });
}
function emailOrderBuild(){
	action="developOrders"
	if(debug==true){
		console.log("Action:  "+action);	}
	var cinfo = {}; // Store customer info into object
		cinfo["last"] = $('input#customerLast').val();
		cinfo["first"] = $('input#customerFirst').val();
		cinfo["full"] = $('input#customerFull').val();
		cinfo["email"] = $('input#customerEmail').val();
		cinfo["notes"] = $('textarea#customerNotes').val();
	var orderinfo = {}; //Store order info into object
		var orderTable = {}; //Order table object
			// Take each Table Row and get the information from it
		$("#orderTable tr.orderLine").each(function(key1, orderRow){
			orderTable[key1] = {}; // Row object
				// Get the Product Name in that row
			orderTable[key1].product = $('select.productSelect :selected',orderRow).text()
				// Get the Notes in that row
			orderTable[key1].comment = $('textarea.comment',orderRow).text();
				// ForEach HTML input tag, match the classes with the order information
			$("input",orderRow).each(function(key2, rowInput){
				if($(this).hasClass('quantity')){
					orderTable[key1].quantity = $(this).val();
				}
				if($(this).hasClass('price')){
					orderTable[key1].price = $(this).val();
				}
				if($(this).hasClass('total')){
					orderTable[key1].total = $(this).val();
				}
			});
		});
		orderinfo["orders"] = orderTable;
		orderinfo["total"]  = $('#orderTotalcost').text();
		orderinfo["date"]   = $('#customerOrders #delivSelect :selected').text();
	// The entire Object, Holding both the customer info and the complete order information
	var built ={};
		built["cinfo"] = cinfo;
		built["oinfo"] = orderinfo;
		built["template"] = $('#emailCustomerTemplate').val();
	//console.log("Orders have been built! :");
	if(debug==true){
		console.log("Orders have been built! :"+built);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 templateID: built.template
			}, 
	  success: function(developed) {
		if(developed.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(developed.newIdentifi){
			verifyIdentifi = developed.newIdentifi;
			if(debug==true){
				console.log(developed);
			}
			action='';
			var fromEmail = developed.r.fromemail.email;
			var template = developed.r.template; // returns emailsubject, emailbody, name, id, customerDefault
			
			$("#emailCustomerFrom").val(fromEmail);
			$("#emailCustomerTo").val(built.cinfo.email);
			
			var subject = templateFiller(template.emailsubject, built);
			$("#emailCustomerSubject").val(subject);
			
			var body = templateFiller(template.emailbody, built);
			$("#emailCustomerBody").val(body);
		}
	 }
	});	
}
function emailOrderTemplates(){
	action="listTemplates";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			}, 
	  success: function(templates) {
		if(templates.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(templates.newIdentifi){
			verifyIdentifi = templates.newIdentifi;
			if(debug==true){
				console.log(templates);
			}
			var list = templates.r;
			var selectListhtml = '';
			var customerDefaultID = '';
			//console.log(list);
			$.each(list, function(key, template){
				//console.log(key + ' ' + template.ID + ' ' + template.ProductName);
				selectListhtml +='<option value="'+template.id+'">'+template.name+'</option>';
				//console.log(selectListhtml);
				if(template.customerDefault == 1){
					customerDefaultID = template.id;
				}
			});
			$('select#emailCustomerTemplate').empty();
			$('select#emailCustomerTemplate').append(selectListhtml);
			$('select#emailCustomerTemplate').trigger('create');
			$('select#emailCustomerTemplate').val(customerDefaultID);
			$('select#emailCustomerTemplate').selectmenu('refresh', true);
			click_listener();
			emailOrderBuild();
			action='';
		}
	 }
	});	
}
function updateTempateDefaults(){
	action="updateTempateDefaults";
	if(debug==true){
		console.log("Action:  "+action);	}
	var d = {};
	$('div#emailerDefaults select').each(function(key, obj){
		d[$(obj).attr("id")] = $(obj).val();
	});
	console.log(d);
	
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 defaults: d
			}, 
	  success: function(defaultsUpdated) {
		if(defaultsUpdated.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(defaultsUpdated.newIdentifi){
			verifyIdentifi = defaultsUpdated.newIdentifi;
			if(debug==true){
				console.log(defaultsUpdated);
			}
			action='';
			update_msg("emailconfigM", defaultsUpdated.r, defaultsUpdated.fail);
			//productInformation($('input#productID').val());
		}
	  }
	});
}
function emailTemplateDelete(){
	action="emailTemplateDelete";
	if(debug==true){
		console.log("Action:  "+action);	}
	var id = $("#emailUpdateid").val();
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 templateID: id
			}, 
	  success: function(templateDeleted) {
		if(templateDeleted.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(templateDeleted.newIdentifi){
			update_msg("emailconfigM", templateDeleted.r, templateDeleted.fail);
			$('.mask, .window').fadeOut(200);
			verifyIdentifi = templateDeleted.newIdentifi;
			if(debug==true){
				console.log(templateDeleted);
			}
			action='';
			if(templateDeleted.fail == false){
				$("#emailUpdateName").val('');
				$("#emailUpdateSubject").val('');
				$("#emailUpdateBody").val('');
				emailTemplateList();
			} else if(templateDeleted.fail == true){
				show_modal("emailUpdateModal");
			}
		}
	  }
	});
}
function emailTemplateFetch(id){
	$("#emailUpdateName").val('');
	$("#emailUpdateid").val('');
	$("#emailUpdateSubject").val('');
	$("#emailUpdateBody").val('');
	action="emailTemplateFetch";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 templateID: id
			}, 
	  success: function(templateFetched) {
		if(templateFetched.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(templateFetched.newIdentifi){
			if(debug==true){
				console.log(templateFetched);
			}
			verifyIdentifi = templateFetched.newIdentifi;
			action='';
			var info = templateFetched.r;
			$("#emailUpdateName").val(info.name);
			$("#emailUpdateid").val(info.id);
			$("#emailUpdateSubject").val(info.emailsubject);
			$("#emailUpdateBody").val(info.emailbody);
		}
	  }
	});
}
function emailTemplateSave(){
	action="emailTemplateSave";
	if(debug==true){
		console.log("Action:  "+action);	}
	var t = {};
	t[":name"] = $("#emailUpdateName").val();
	t[":id"] = $("#emailUpdateid").val();
	t[":subject"] = $("#emailUpdateSubject").val();
	t[":body"] = $("#emailUpdateBody").val();
	console.log(t);
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 info: t
			}, 
	  success: function(TemplateSaved) {
		if(TemplateSaved.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(TemplateSaved.newIdentifi){
			$('.mask, .window').fadeOut(200);
			if(debug==true){
				console.log(TemplateSaved);
			}
			verifyIdentifi = TemplateSaved.newIdentifi;
			action='';
			update_msg("emailconfigM", TemplateSaved.r, TemplateSaved.fail);
			if(TemplateSaved.fail == false){
				$("#emailUpdateName").val('');
				$("#emailUpdateid").val('');
				$("#emailUpdateSubject").val('');
				$("#emailUpdateBody").val('');
			}
		}
	  }
	});
}
function emailTemplateList(){
	action="listTemplates";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			}, 
	  success: function(templates) {
		if(templates.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(templates.newIdentifi){
			verifyIdentifi = templates.newIdentifi;
			if(debug==true){
				console.log(templates);
			}
			$('div#emailTemplateList').empty();
			$('div#emailTemplateList').append('<div id="emailListLeft" class="column2"> </div><div id="emailListRight" class="column2"></div>');
			var list = templates.r;
			var selectListhtml = '';
			var customerDefaultID = '';
			//console.log(list);
			var half= $(list).length/2;
			$.each(list, function(key, template){
				//console.log(key + ' ' + template.ID + ' ' + template.ProductName);
				//splits object into two columns for space conservation
				if(key>=half){
					$('div#emailTemplateList #emailListRight').append('<input class="hoverpurple tinyshadow templateItem" id="Template'+template.id+'" templateID="'+template.id+'" type="button" value="'+template.name+'">');
				} else{
					$('div#emailTemplateList #emailListLeft').append('<input class="hoverpurple tinyshadow templateItem" id="Template'+template.id+'" templateID="'+template.id+'" type="button" value="'+template.name+'">');
				}
				selectListhtml +='<option value="'+template.id+'">'+template.name+'</option>';
				//console.log(selectListhtml);
				if(template.customerDefault == 1){
					customerDefaultID = template.id;
				}
			});
			$('div#emailTemplateList').trigger('create');
			$('select#customerDefault').empty();
			$('select#customerDefault').append(selectListhtml);
			$('select#customerDefault').trigger('create');
			$('select#customerDefault').val(customerDefaultID);
			$('select#customerDefault').selectmenu('refresh', true);
			click_listener();
			action='';
		}
	 }
	});	
}
function emailTemplateCreate(){
	action="emailTemplateCreate";
	if(debug==true){
		console.log("Action:  "+action);	}
	var nt = {};
	nt[":name"] = $("#emailCreateName").val();
	nt[":subject"] = $("#emailCreateSubject").val();
	nt[":body"] = $("#emailCreateBody").val();
	//console.log(nt);
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 info: nt
			}, 
	  success: function(templateCreated) {
		if(templateCreated.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(templateCreated.newIdentifi){
			$('.mask, .window').fadeOut(200);
			if(debug==true){
				console.log(templateCreated);
			}
			verifyIdentifi = templateCreated.newIdentifi;
			action='';
			update_msg("emailconfigM", templateCreated.r, templateCreated.fail);
			if(templateCreated.fail == false){
				$("#emailCreateName").val('');
				$("#emailCreateSubject").val('');
				$("#emailCreateBody").val('');
			}
			emailTemplateList();
		}
	  }
	});
}
function emailLoginFetch(){
	action="emailLoginFetch";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			}, 
	  success: function(loginFetched) {
		if(loginFetched.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(loginFetched.newIdentifi){
			if(debug==true){
				console.log(loginFetched);
			}
			verifyIdentifi = loginFetched.newIdentifi;
			action='';
			var info = loginFetched.r[0];
			$("#emailName").val(info.fromname);
			$("#emailHost").val(info.host);
			$("#emailPort").val(info.port);
			$("#emailEmail").val(info.fromemail);
			$("#emailUser").val(info.user);
			var decryptPass = decodeURIComponent(escape(atob(info.pass)));
			$("#emailPass").val(decryptPass);
			emailTemplateList();
		}
	  }
	});
}
function emailLoginSave(){
	action="emailLoginSave";
	if(debug==true){
		console.log("Action:  "+action);	}
	var u = {};
	u[":host"] = $("#emailHost").val();
	u[":name"] = $("#emailName").val();
	u[":port"] = $("#emailPort").val();
	u[":email"] = $("#emailEmail").val();
	u[":user"] = $("#emailUser").val();
	u[":pass"] = btoa(unescape(encodeURIComponent($("#emailPass").val())));
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/fruitEmailFunc.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 info: u
			}, 
	  success: function(loginSaved) {
		if(loginSaved.identifi==false){
			update_msg("emailconfigM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(loginSaved.newIdentifi){
			if(debug==true){
				console.log(loginSaved);
			}
			verifyIdentifi = loginSaved.newIdentifi;
			action='';
			update_msg("emailconfigM", loginSaved.r, loginSaved.fail);
		}
	  }
	});
}


function deleteProduct(prodID){
	if(!prodID){
		update_msg("productsM", "Improper function call.", true);
		return false;
	}
	action="delProduct";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/productManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 prodID: prodID
			}, 
	  success: function(delreply) {
		if(delreply.identifi==false){
			update_msg("productsM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(delreply.newIdentifi){
			$('.mask, .window').fadeOut(200);
			if(debug==true){
				console.log(delreply);
			}
			verifyIdentifi = delreply.newIdentifi;
			update_msg("productsM", delreply.r, delreply.fail);
			action='';
			listProducts();
		}
	  }
	});
}
function createProduct(){
	action="createProduct";
	if(debug==true){
		console.log("Action:  "+action);	}
	var np = {};
	np[':pname']  = $('input#productAddName').val();
	np[":pcat"]  = $('input#productAddCategory').val();
	if($('select#productAddBoxsize').val() == 'full'){
		np[":pbox"]  = 1;
	}else{
		np[":pbox"]  = 0.5
	}
	np[":pcost"] = $('input#productAddCost').val();
	np[":pprice"]= $('input#productAddPrice').val();
	np[":pavail"]= '';
	//var p[":pmons"] = {};
	$('[id^="productAdd"] .checkbox').each(function(k, v){
				//console.log(k + ' ' + $(v).prop('checked'));
		if($(v).prop('checked')){
			np[":"+$(v).prop('id').substring(10)] = 1;
			if(k==11){
				np[":pavail"] += $(v).prop('id').substring(10);
			}else{
				np[":pavail"] += $(v).prop('id').substring(10)+', ';
			}
		} else{
			np[":"+$(v).prop('id').substring(10)] = 0;
		}
	});
	var allClear=true;
	$('div#productAddInputs [id^="productAdd"]').each(function(key, obj){
		//console.log($(obj).prop('id')+"   ---/\---"+$(obj).val());
		if($(obj).val() ==''){
			$('.mask, .window').fadeOut(200);
			update_msg("productsM", "Not all of the fields are filled out.", true);
				setTimeout(function(){show_modal('productAddModal')}, 1500);
			$(obj).focus();
			allClear=false;
		}
	});
	if(allClear){
		console.log(np);
		$.ajax({  
		  type: "POST",  
		  dataType: "json",
		  url: "fruit/func/productManagement.php",  
		  data: {action: action,
				 verifyIdentifi: verifyIdentifi,
				 newprod: np
				}, 
		  success: function(productCreate) {
			if(productCreate.identifi==false){
				update_msg("productsM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
			}else if(productCreate.newIdentifi){
				$('.mask, .window').fadeOut(200);
				if(debug==true){
					console.log(productCreate);
				}
				verifyIdentifi = productCreate.newIdentifi;
				action='';
				if(productCreate.fail){
					setTimeout(function(){show_modal('productAddModal')}, 1500);
				} else{
					$('[id^="productAdd"]').val('');
					$('select[id^="productAdd"]').prop('selectedIndex',0);
					$('input[id^="productAdd"]').removeAttr('checked');
				}
				update_msg("productsM", productCreate.r, productCreate.fail);
				listProducts();
			}
		  }
		});	
	}
}
function updateProduct(prodID){
	if(prodID == 0){
		update_msg("productsM", "A product needs to be selected in order to update it.", true);
		return false;
	}
	action="updateProduct";
	if(debug==true){
		console.log("Action:  "+action);	}
	var p = {};
	p[':pname']  = $('input#productName').val();
	p[":pid"]   = prodID;
	p[":pcat"]  = $('input#productCategory').val();
	if($('select#productBoxsize').val() == 'full'){
		p[":pbox"]  = 1;
	}else{
		p[":pbox"]  = 0.5
	}
	p[":pcost"] = $('input#productCost').val();
	p[":pprice"]= $('input#productPrice').val();
	p[":pavail"]= '';
	//var p[":pmons"] = {};
	$('#productInfo [id^="product"] .checkbox').each(function(k, v){
				//console.log(k + ' ' + $(v).prop('checked'));
		if($(v).prop('checked')){
			p[":"+$(v).prop('id').substring(7)] = 1;
			if(k==11){
				p[":pavail"] += $(v).prop('id').substring(7);
			}else{
				p[":pavail"] += $(v).prop('id').substring(7)+', ';
			}
		} else{
			p[":"+$(v).prop('id').substring(7)] = 0;
		}
	});
	//console.log(p);
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/productManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 prod: p
			}, 
	  success: function(productUpdate) {
		if(productUpdate.identifi==false){
			update_msg("productsM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(productUpdate.newIdentifi){
			if(debug==true){
				console.log(productUpdate);
			}
			verifyIdentifi = productUpdate.newIdentifi;
			action='';
			update_msg("productsM", productUpdate.r, productUpdate.fail);
			productInformation($('input#productID').val());
		}
	  }
	});	
}
function productInformation(prodID){
	if(!prodID){
		update_msg("productsM", "Improper function call.", true);
		return false;
	}
	action="getProduct";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/productManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 prodID: prodID
			}, 
	  success: function(product) {
		if(product.identifi==false){
			update_msg("productsM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(product.newIdentifi){
			verifyIdentifi = product.newIdentifi;
			if(debug==true){
				console.log(product);
			}
			//console.log(product.r);
			k = product.r;
			if(debug==true){
				console.log(k);
			}
				$('#productTitle').empty();
				$('#productTitle').append(k.info.ProductName);
				$('input#productName').val(k.info.ProductName);
				$('input#productID').val(k.info.id);
				$('input#productCategory').val(k.info.Category);
				if(k.info.BoxSize < 1){
					$('select#productBoxsize').val('half');
				}
				if(k.info.BoxSize >= 1){
					$('select#productBoxsize').val('full');
				}
				$("select#productBoxsize").selectmenu('refresh', true);
				$('input#productCost').val(k.info.ourcost);
				$('input#productPrice').val(k.info.price);
				$('input#productAvailability').val(k.info.Availability);
				
				$.each(k.months, function(month, value){
					if(value == 1){
						$('#product'+month).prop('checked', true);
					}else{
						$('#product'+month).prop('checked', false);
					}
				});
		}
	  }
	});	
}
function listProducts(){
	action="listProducts";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/productManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			}, 
	  success: function(products) {
		if(products.identifi==false){
			update_msg("productsM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(products.newIdentifi){
			verifyIdentifi = products.newIdentifi;
			$('div#productList').empty();
			$('div#productList').append('<div id="prodListLeft" class="column2"></div><div id="prodListRight" class="column2"></div>');
			if(debug==true){
				console.log(products);
			}
			var list = products.r;
			var prodList='';
			var half= $(list).length/2;
			$.each(list, function(key, value){
				//console.log(key + ' ' + value.ID + ' ' + value.ProductName);
				//splits object into two columns for space conservation
				if(key>=half){
					$('div#productList #prodListRight').append('<input class="hoverpurple tinyshadow productItem" id="Product'+value.ID+'" prodID="'+value.ID+'" type="button" value="'+value.ProductName+'">');
				} else{
					$('div#productList #prodListLeft').append('<input class="hoverpurple tinyshadow productItem" id="Product'+value.ID+'" prodID="'+value.ID+'" type="button" value="'+value.ProductName+'">');
				}
			});
			
			$('div#productList').trigger('create');
			click_listener();
			action='';
		}
	 }
	});	
}
function addDate(){
	action="addDelivDate";
	if(debug==true){
		console.log("Action:  "+action);	}
	var dueDate = $('#ndelivDue').val();
	var delivDate = $('#ndelivDate').val()
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/productManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 orderDate: dueDate,
			 delivDate: delivDate
			}, 
	  success: function(dates) {
		if(dates.identifi==false){
			update_msg("dateM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(dates.newIdentifi){
			verifyIdentifi = dates.newIdentifi;
			if(debug==true){
				console.log(dates);
			}
			update_msg("dateM", dates.r, dates.fail);
			action='';
			delivDates(true);
		}
			
	 }
	});
}

function delivDates(old){
	old = typeof old !== 'undefined' ? old : false;
	//console.log("Old is: "+old);
	var action = 'delivDates';
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/productManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 old: old
			}, 
	  success: function(dates) {
		if(dates.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(dates.newIdentifi){
			verifyIdentifi = dates.newIdentifi;
			if(debug==true){
				console.log(dates);
			}
			$('div.delivSelect').empty();
			var list = dates.r;
			var selectHTML='';
			$.each(list, function(key, value){
				//console.log(k + ' ' + v);
				selectHTML += value;
			});
			$('div.delivSelect').append(selectHTML);
			$('div.delivSelect').trigger('create');
			action='';
			delivDateid = $('#delivSelect').val();
		}
	 }
	});	
}
function saveOrderRow(){
	var action = "saveOrderRow";
	if(debug==true){
		console.log("Action:  "+action);	}
	var orderTable = {};
	$("#orderTable tr.orderLine").each(function(key1, orderRow){
		orderTable[key1] = {};
		orderTable[key1].product = $('select.productSelect',orderRow).val()
		orderTable[key1].comment = $('textarea.comment',orderRow).val();
		$("input",orderRow).each(function(key2, rowInput){
			if($(this).hasClass('quantity')){
				orderTable[key1].quantity = $(this).val();
			}
			//if($(this).hasClass('price')){
			//	orderTable[key1].price = $(this).val();
			//}
			//if($(this).hasClass('total')){
			//	orderTable[key1].total = $(this).val();
			//}
		});

	});
	//console.log(orderTable);
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/orderManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 cid: custid,
			 delivid: delivDateid,
			 oInfo: orderTable
			}, 
	  success: function(saveOrder) {
		if(saveOrder.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(saveOrder.newIdentifi){
			verifyIdentifi = saveOrder.newIdentifi;
			if(debug==true){
				console.log(saveOrder);
			}
			if(saveOrder.fail){
				update_msg("customersM", saveOrder.r, saveOrder.fail);
			}else if(saveOrder.fail ==false){
				buildCustOrders(custid, delivDateid);
				update_msg("customersM", "Saved.",false,true);
			}
		}
	 }
	});	
}
function addOrderRow(){
	//saveOrderRow();
	var action = "addOrderRow";
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/orderManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 cid: custid,
			 delivid: delivDateid
			}, 
	  success: function(addOrder) {
		if(addOrder.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(addOrder.newIdentifi){
			verifyIdentifi = addOrder.newIdentifi;
			if(debug==true){
				console.log(addOrder);
			}
			if(addOrder.fail){
				update_msg("customersM", addOrder.r, addOrder.fail);
			}else{
				buildCustOrders(custid, delivDateid);
			}
		}
	 }
	});	
}

function buildCustOrders(cid, delivid){
	$('div#orderWindow').fadeOut(100)
	$('div#orderWindow').empty();
	var action = 'buildCustomerOrders';
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/orderManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 cid: cid,
			 delivid: delivDateid
			}, 
	  success: function(orderStructure) {
		if(orderStructure.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(orderStructure.newIdentifi){
			verifyIdentifi = orderStructure.newIdentifi;
			if(debug==true){
				console.log(orderStructure);
			}
			var selectHTML='';
			var list = orderStructure.r;
			$.each(list, function(key, value){
				//console.log(k + ' ' + v);
				selectHTML += value;
			});
			
			$('div#orderWindow').append(selectHTML);
			$('div#orderWindow').trigger('create');
			$('div#orderWindow').fadeIn(100);
			action='';
			var totalCost=0;
			$('.total').each(function( index ) {
				totalCost+=Number($(this).val());
			});
			$('#orderTotalcost').empty();
			$('#orderTotalcost').append("$"+totalCost.toFixed(2));
			click_listener();
		}
	 }
	});	
}
function getCustInfo(id){
	$('[id^="customer"]').val('');
	$('select[id^="customer"]').prop('selectedIndex',0);
	$('input[id^="customerWant"]').removeAttr('checked');
	var action = 'getCustomer';
	if(debug==true){
		console.log("Action:  "+action);	}
	$("div#idHolder p.id").empty();
	$("div#idHolder p.id").append(id);
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/customerManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 custid: id
			},
	  success: function(CustInfo) {
		if(CustInfo.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(CustInfo.newIdentifi){
			verifyIdentifi = CustInfo.newIdentifi;
			if(CustInfo.fail == true){
				update_msg("customersM", CustInfo.r, CustInfo.fail);
			}
			if(debug==true){
				console.log(CustInfo);
			}
			action='';
			buildCustOrders(id,delivDateid);
			var k = CustInfo.r;
				$('input#customerLast').val(k.LastName);
				$('input#customerFirst').val(k.FirstName);
				$('input#customerFull').val(k.FullName);
				$('textarea#customerAddress').val(k.Address);
				$('input#customerCity').val(k.City);
				$('select#customerState').val(k.State);
				$("select#customerState").selectmenu('refresh', true);
				$('input#customerZip').val(k.Zip);
				if(k.HomePhone){
					var homephone = k.HomePhone.split('-');
					if(homephone[2]){
						$('input#customerHomeA').val(homephone[0]);
						$('input#customerHomeB').val(homephone[1]);
						$('input#customerHomeC').val(homephone[2]);
					}else{
						$('input#customerHomeB').val(homephone[0]);
						$('input#customerHomeC').val(homephone[1]);
					}
				}
				if(k.CellPhone){
					var cellphone = k.CellPhone.split('-');
					if(cellphone[2]){
						$('input#customerCellA').val(cellphone[0]);
						$('input#customerCellB').val(cellphone[1]);
						$('input#customerCellC').val(cellphone[2]);
					}else{
						$('input#customerCellB').val(cellphone[0]);
						$('input#customerCellC').val(cellphone[1]);
					}
				}
				if(k.WorkPhone){
					var workphone = k.WorkPhone.split('-');
					if(workphone[2]){
						$('input#customerWorkA').val(workphone[0]);
						$('input#customerWorkB').val(workphone[1]);
						$('input#customerWorkC').val(workphone[2]);
					}else{
						$('input#customerWorkB').val(workphone[0]);
						$('input#customerWorkC').val(workphone[1]);
					}
				}
				$('input#customerEmail').val(k.EmailAddress);
				$('textarea#customerNotes').val(k.Notes);
				if(k.PrefersEmail == 1){
					$('#customerWantEmail').prop('checked', true);
				}else{
					$('#customerWantEmail').prop('checked', false);
				}
				if(k.PrefersPhone == 1){
					$('#customerWantPhone').prop('checked', true);
				}else{
					$('#customerWantPhone').prop('checked', false);
				}
				if(k.PrefersPostal == 1){
					$('#customerWantPostal').prop('checked', true);
				}else{
					$('#customerWantPostal').prop('checked', false);
				}
				//$("select#studentSelectorder").trigger('create');
				$("#customerStudent select#studentSelectorder").val(k.studentid);
				$("#customerStudent select#studentSelectorder").selectmenu('refresh', true);
			}
	 }
	});	

}
function updateCustomer(){
	var action = 'updateCustomer';
	if(debug==true){
		console.log("Action:  "+action);	}
	var c={};
	c[':custid'] = custid;
	c[':last'] = $('input#customerLast').val();
	c[':first'] = $('input#customerFirst').val();
	c[':full'] = $('input#customerFull').val();
	c[':addr'] = $('textarea#customerAddress').val();
	c[':city'] = $('input#customerCity').val();
	c[':state'] = $('select#customerState').val();
	c[':zip'] = $('input#customerZip').val();
	var chomeA = $('input#customerHomeA').val();
	var chomeB = $('input#customerHomeB').val();
	var chomeC = $('input#customerHomeC').val();
		c[':home'] = chomeA+'-'+chomeB+'-'+chomeC;
	var ccellA = $('input#customerCellA').val();
	var ccellB = $('input#customerCellB').val();
	var ccellC = $('input#customerCellC').val();
		c[':cell'] = ccellA+'-'+ccellB+'-'+ccellC;
	var cworkA = $('input#customerWorkA').val();
	var cworkB = $('input#customerWorkB').val();
	var cworkC = $('input#customerWorkC').val();
		c[':work'] = cworkA+'-'+cworkB+'-'+cworkC;
	c[':email'] = $('input#customerEmail').val();
	c[':notes'] = $('textarea#customerNotes').val();
	if($('#customerWantPhone').prop('checked')){
		c[':wp'] = 1;
	}else{
		c[':wp'] = 0;
	}
	if($('#customerWantEmail').prop('checked')){
		c[':we'] = 1;
	}else{
		c[':we'] = 0;
	}
	if($('#customerWantPostal').prop('checked')){
		c[':wpostal'] = 1;
	}else{
		c[':wpostal'] = 0;
	}
	c[':studentid'] = $("#customerStudent select#studentSelectorder").val();
	//console.log(c);
	if(c[':last']==''||c[':first']==''||c[':full']==''){
		update_msg('customersM', "Essential fields must be filled.", true)
		if(c[':last']==''){
			$('input#customerLast').focus();
			return false;
		}
		if(c[':first']==''){
			$('input#customerFirst').focus();
			return false;
		}
		if(c[':full']==''){
			$('input#customerFull').focus();
			return false;
		}
	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/customerManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 c: c
			},
	  success: function(customerR) {
		if(customerR.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(customerR.newIdentifi){
			if(debug==true){
				console.log(customerR);
			}
			verifyIdentifi = customerR.newIdentifi;
			action='';
			update_msg("customersM", customerR.r, customerR.fail);
		}
			
	 }
	});
}
function createCustomer(){
	var action = 'createCustomer';
	if(debug==true){
		console.log("Action:  "+action);	}
	var nc = {};
	nc[':last'] = $('input#newcustomerLast').val();
	nc[':first'] = $('input#newcustomerFirst').val();
	nc[':full'] = $('input#newcustomerFull').val();
	nc[':addr'] = $('textarea#newcustomerAddress').val();
	nc[':city'] = $('input#newcustomerCity').val();
	nc[':state'] = $('select#newcustomerState').val();
	nc[':zip'] = $('input#newcustomerZip').val();
	var nchomeA = $('input#newcustomerHomeA').val();
	var nchomeB = $('input#newcustomerHomeB').val();
	var nchomeC = $('input#newcustomerHomeC').val();
		nc[':home'] = nchomeA+'-'+nchomeB+'-'+nchomeC;
	var nccellA = $('input#newcustomerCellA').val();
	var nccellB = $('input#newcustomerCellB').val();
	var nccellC = $('input#newcustomerCellC').val();
		nc[':cell'] = nccellA+'-'+nccellB+'-'+nccellC;
	var ncworkA = $('input#newcustomerWorkA').val();
	var ncworkB = $('input#newcustomerWorkB').val();
	var ncworkC = $('input#newcustomerWorkC').val();
		nc[':work'] = ncworkA+'-'+ncworkB+'-'+ncworkC;
	nc[':email'] = $('input#newcustomerEmail').val();
	nc[':notes'] = $('textarea#newcustomerNotes').val();
	if($('#newcustomerWantPhone').prop('checked')){
		nc[':wp'] = 1;
	}else{
		nc[':wp'] = 0;
	}
	if($('#newcustomerWantEmail').prop('checked')){
		nc[':we'] = 1;
	}else{
		nc[':we'] = 0;
	}
	if($('#newcustomerWantPostal').prop('checked')){
		nc[':wpostal'] = 1;
	}else{
		nc[':wpostal'] = 0;
	}
	nc[':studentid'] = $('#addCustomer #studentSelectorder').val();
	if(nc[':l']==''||nc[':f']==''||nc[':full']==''){
		update_msg('newcustM', "Essential fields must be filled.", true)
		if(nc[':last']==''){
			$('input#newcustomerLast').focus();
			return false;
		}
		if(nc[':first']==''){
			$('input#newcustomerFirst').focus();
			return false;
		}
		if(nc[':full']==''){
			$('input#newcustomerFull').focus();
			return false;
		}
	}
	//console.log(nc);
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/customerManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 nc: nc
			},
	  success: function(newCustomerR) {
		if(newCustomerR.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(newCustomerR.newIdentifi){
			$('.mask, .window').fadeOut(200);
			if(debug==true){
				console.log(newCustomerR);
			}
			verifyIdentifi = newCustomerR.newIdentifi;
			action='';
			update_msg("customersM", newCustomerR.r, newCustomerR.fail);
			if(newCustomerR.fail){
				setTimeout(function(){show_modal('addCustomer')}, 1500);
			} else{
				$('.modalLeftColumn [id^="newcustomer"]').val('');
				$('select[id^="newcustomer"]').prop('selectedIndex',0);
				$('input[id^="newcustomerWant"]').removeAttr('checked');
				$('#addCustomer #studentSelectorder').prop('selectedIndex',0);
				listCustomers("order");
			}
		}
	 }
	});	
}
function listCustomers(listFor, first){
	first = typeof first !== 'undefined' ? first : false;
	$('.customerListdiv').off();
	var action = 'listCustomers';
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/customerManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 lf: listFor
			}, 
	  success: function(customerList) {
		if(customerList.identifi==false){
			update_msg("customersM", "Authentication token not valid, please logout and login to reauthenticate.", true, false);
		}else if(customerList.newIdentifi){
			verifyIdentifi = customerList.newIdentifi;
			if(debug==true){
				console.log(customerList);
			}
			$('div.customerListdiv').empty();
			$('div.customersListdiv').empty();
			var list = customerList.r;
			var selectHTML='';
			//console.log(list);
			$.each(list, function(key, value){
				//console.log(k + ' ' + v);
				selectHTML += value;
			});
			//$('div.customerListdiv').append(customerList.r);
			/*if(listFor !== 'order'){
				$('div.customerListdiv').trigger('create');
			}*/
			action='';
				
			$('div.customerListdiv').append(selectHTML);
			$('div.customerListdiv').trigger('create');
			
			if(first && listFor=='order'){
				listStudents('order', true);
			}
			/* if(first && listFor=='customer'){
				listStudents('customer');
			} */
			$('select#customerSelectorder').trigger('create');
			click_listener();
		}
	 }
	});	
}
function listStudents(listFor, first){
	first = typeof first !== 'undefined' ? first : false;
	var action = 'listStudents';
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/studentManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 lf: listFor
			 },
	  success: function(studentsList) { 
		if(studentsList.identifi==false){
			update_msg("studentsM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
		}else if(studentsList.newIdentifi){
			if(debug==true){
				console.log(studentsList);
			}
			$('div.studentListdiv').empty();
			$('div.studentListdiv').append(studentsList.r);
			if(listFor !== 'order'){
				$('div.studentListdiv').trigger('create');
			}
			$('#customerStudent div.studentListdiv').trigger('create');
			verifyIdentifi = studentsList.newIdentifi;
			action='';
			click_listener();
			if(first && listFor=='order'){
				delivDates();
			}
			$("select#studentSelectorder").trigger('create');
		}
	 }
	});	
}
function deleteStudents(){
	var action = 'deleteStudents';
	if(debug==true){
		console.log("Action:  "+action);	}
	show_modal('studentDeleteModal');
	$('#yesDeleteAllStudents').on('click', function(){
        $('.mask, .window').fadeOut(200);
        $('.window').fadeOut(200);
		$.ajax({  
		  type: "POST",  
		  dataType: "json",
		  url: "fruit/func/studentManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			 },
		  success: function(clearStudentResults) {
			if(clearStudentResults.identifi==false){
				update_msg("studentsM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
			}else if(clearStudentResults.newIdentifi){
				if(debug==true){
					console.log(clearStudentResults);
				}
				verifyIdentifi = clearStudentResults.newIdentifi;
				listStudents('student');
				update_msg("studentsM", clearStudentResults.r, clearStudentResults.fail);
				action='';
				$('#yesDeleteAllStudents').off();
			}
		}
	});
	});
}

function clearStudents(){
	var action = 'clearStudents';
	if(debug==true){
		console.log("Action:  "+action);	}
	show_modal('studentClearModal');
	$('#yesClearallStudents').on('click', function(){
        $('.mask, .window').fadeOut(200);
        $('.window').fadeOut(200);
		$.ajax({  
		  type: "POST",  
		  dataType: "json",
		  url: "fruit/func/studentManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			 },
		  success: function(clearStudentResults) {
			if(clearStudentResults.identifi==false){
				update_msg("studentsM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
			}else if(clearStudentResults.newIdentifi){
				if(debug==true){
					console.log(clearStudentResults);
				}
				console.log(clearStudentResults);
				verifyIdentifi = clearStudentResults.newIdentifi;
				listStudents('student');
				update_msg("studentsM", clearStudentResults.r, clearStudentResults.fail);
				action='';
				$('#yesClearallStudents').off();
			}
		}
	});
	});
}
function delStudent(id){
	var action = 'delStudent';
	if(debug==true){
		console.log("Action:  "+action);	}
	if(id == "" || id == "fish"){
		update_msg("studentsM", "Please select a student to delete.", true);
		return false;
	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/studentManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 id: id
			}, 
	  success: function(delStudentResults) {
		if(delStudentResults.identifi==false){
			update_msg("studentsM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
		}else if(delStudentResults.newIdentifi){
			if(debug==true){
				console.log(delStudentResults);
			}
			verifyIdentifi = delStudentResults.newIdentifi;
			listStudents('student');
			update_msg("studentsM", delStudentResults.r, delStudentResults.fail);
			action='';
		}
	}
	});
}
function addStudent(){
	var action = 'addStudent';
	if(debug==true){
		console.log("Action:  "+action);	}
	var ns = {};
	ns['first'] = $('input#addStudentFirst').val();
	ns['last'] = $('input#addStudentLast').val();
	ns['full'] = $('input#addStudentFull').val();
	//console.log(newUser+" "+newUserpwd1+" "+newUserpwd2+" "+verifyIdentifi);
	if(ns['first'] == '' || ns['last'] =='' || ns['full']==''){
		update_msg("studentsM", "Please fill out all of the fields.", true);
		if(ns['first'] == ''){
			$('input#addStudentFirst').focus();
		}
		if(ns['last'] == ''){
			$('input#addStudentLast').focus();
		}
		if(ns['full'] == ''){
			$('input#addStudentFull').focus();
		}
		return false;
	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/studentManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 newStudent: ns
			},
	  success: function(addStudentResults) { 
		if(addStudentResults.identifi==false){
			update_msg("studentsM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
		}else if(addStudentResults.newIdentifi){
			if(debug==true){
				console.log(addStudentResults);
			}
			verifyIdentifi = addStudentResults.newIdentifi;
			update_msg("studentsM", addStudentResults.r, addStudentResults.fail);
			if(addStudentResults.fail == false){
				$('input#addStudentFirst').val('');
				$('input#addStudentLast').val('');
				$('input#addStudentFull').val('');
			}
			listStudents('student');
			action='';
			click_listener();
		}
	}
	});
	
}
function listUsers(){
	var action = 'listUsers';
	if(debug==true){
		console.log("Action:  "+action);	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/userManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi
			},
	  success: function(usersList) { 
		if(usersList.identifi==false){
			update_msg("usersM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
		}else if(usersList.newIdentifi){
			if(debug==true){
				console.log(usersList);
			}
			$('table#userList').empty();
			$('table#userList').append(usersList.r);
			$('table#userList').trigger('create');
			verifyIdentifi = usersList.newIdentifi;
			action='';
			click_listener();
		}
	}
	});	
}
function resetUser(uid){
	var action = 'resetUser';
	if(debug==true){
		console.log("Action:  "+action);
	}
	show_modal('resetUserpwd');
	$("#resetUserBtn").on("click", function(){
		$("#usersMr").empty();
		$("#usersMr").fadeOut(100);	
		var resetUserpwd1 = $('input#resetUser1').val();
		var resetUserpwd2 = $('input#resetUser2').val();
		if(resetUserpwd1 == '' || resetUserpwd2 ==''){
			update_msg("usersMr", "Please enter and verify a password.", true);
			$('input#resetUser1').val('');
			$('input#resetUser2').val('');
			$('input#resetUser1').focus();
			return false;
		}
		if(resetUserpwd1 !== resetUserpwd2){
			update_msg("usersMr", "Passwords do not match.", true);
			$('input#resetUser1').val('');
			$('input#resetUser2').val('');
			$('input#resetUser1').focus();
			return false;
		}
		$.ajax({  
		  type: "POST",  
		  dataType: "json",
		  url: "fruit/func/userManagement.php",  
		  data: {action: action,
				 verifyIdentifi: verifyIdentifi,
				 uid: uid,
				 newUserpwd1: resetUserpwd1,
				 newUserpwd2: resetUserpwd2
				}, 
		  success: function(userResetResults) { 
			if(userResetResults.identifi==false){
				update_msg("usersM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
			}else if(userResetResults.newIdentifi){
				$('.mask, .window').fadeOut(200);
				if(debug==true){
					console.log(userResetResults);
				}
				verifyIdentifi = userResetResults.newIdentifi;
				listUsers();
				update_msg("usersM", userResetResults.r, userResetResults.fail);
				action='';
			}
		}
		});
	});
}
function delUser(uid){
	var action = 'delUser';
	if(debug==true){
		console.log("Action:  "+action);
	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/userManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 uid: uid
			}, 
	  success: function(userDelResults) { 
		if(userDelResults.identifi==false){
			update_msg("usersM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
		}else if(userDelResults.newIdentifi){
			if(debug==true){
				console.log(userDelResults);
			}
			verifyIdentifi = userDelResults.newIdentifi;
			listUsers();
			update_msg("usersM", userDelResults.r, userDelResults.fail);
			action='';
		}
	}
	});	
}
function addUser(){
	var action = 'addUser';
	if(debug==true){
		console.log("Action:  "+action);
	}
	var newUser = {};
	newUser['name'] = $('input#addUserName').val();
	newUser['pwd1'] = $('input#addUserpwd1').val();
	newUser['pwd2'] = $('input#addUserpwd2').val();
	if(newUser['pwd1'] !== newUser['pwd2']){
		$('input#addUserpwd1').val('');
		$('input#addUserpwd2').val('');
		$('input#addUserpwd1').focus();
		update_msg("usersM", "Passwords do not match.", true);
		return false;
	}
	if(newUser['pwd2'] == '' ||newUser['pwd2'] ==''){
		$('input#addUserpwd1').val('');
		$('input#addUserpwd2').val('');
		$('input#addUserpwd1').focus();
		update_msg("usersM", "Please enter and verify a password.", true);
		return false;
	}
	$.ajax({  
	  type: "POST",  
	  dataType: "json",
	  url: "fruit/func/userManagement.php",  
	  data: {action: action,
			 verifyIdentifi: verifyIdentifi,
			 newUser: newUser
			},
	  success: function(addUserResults) { 
		if(addUserResults.identifi==false){
			update_msg("usersM", "Authentication token not valid, please logout and login to reauthenticate", true, false);
		}else if(addUserResults.newIdentifi){
			if(debug==true){
				console.log(addUserResults);
			}
			verifyIdentifi = addUserResults.newIdentifi;
			listUsers();
			update_msg("usersM", addUserResults.r, addUserResults.fail);
			if(!addUserResults.fail){
				$('input#addUserName').val('');
				$('input#addUserpwd1').val('');
				$('input#addUserpwd2').val('');
			}
			action='';
		}
	}
	});
}
function addCustomer(){
	show_modal('addCustomer');
	$('input#newcustomerFirst').keyup(function(){
		//console.log("key went up");
		var firstName = $('input#newcustomerFirst').val();
		var lastName = $('input#newcustomerLast').val();
		var fullName = lastName+", "+firstName;
		$('input#newcustomerFull').val(fullName);
	});
}