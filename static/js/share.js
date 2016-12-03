


jQuery(function(){
	var script_source = jQuery('script[src*="share.js"]').attr('src');
	var params = function(name,default_value) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(script_source);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '))||default_value;
	}
	var path = params('static','social');
	var url = encodeURIComponent(window.location.href);
	var host =  window.location.hostname;
	var title = escape(jQuery('title').text());
	var twit = 'http://twitter.com/home?status='+title+'%20'+url;
	var facebook = 'http://www.facebook.com/sharer.php?u='+url;
	var gplus = 'https://plus.google.com/share?url='+url;
	var tbar = '<div id="socialdrawer"><span>Share<br/></span><div id="sicons"><a href="'+twit+'" id="twit" title="Share on twitter"><img src="'+path+'/twitter.png"  alt="Share on Twitter" width="32" height="32" /></a><a href="'+facebook+'" id="facebook" title="Share on Facebook"><img src="'+path+'/facebook.png"  alt="Share on facebook" width="32" height="32" /></a><a href="'+gplus+'" id="gplus" title="Share on Google Plus"><img src="'+path+'/gplus-32.png"  alt="Share on Google Plus" width="32" height="32" /></a></div></div>';
	// Add the share tool bar.
	jQuery('body').append(tbar);
	var st = jQuery('#socialdrawer');
	st.css({'opacity':'.7','z-index':'3000','background':'#FFF','border':'solid 1px #666','border-width':' 1px 0 0 1px','height':'20px','width':'40px','position':'fixed','bottom':'0','right':'0','padding':'2px 5px','overflow':'hidden','-webkit-border-top-left-radius':' 12px','-moz-border-radius-topleft':' 12px','border-top-left-radius':' 12px','-moz-box-shadow':' -3px -3px 3px rgba(0,0,0,0.5)','-webkit-box-shadow':' -3px -3px 3px rgba(0,0,0,0.5)','box-shadow':' -3px -3px 3px rgba(0,0,0,0.5)'});
	jQuery('#socialdrawer a').css({'float':'left','width':'32px','margin':'3px 2px 2px 2px','padding':'0','cursor':'pointer'});
	jQuery('#socialdrawer span').css({'float':'left','margin':'2px 3px','text-shadow':' 1px 1px 1px #FFF','color':'#444','font-size':'12px','line-height':'1em'});
	jQuery('#socialdrawer img').hide();
	// hover
	st.click(function(){
		jQuery(this).animate({height:'40px', width:'160px', opacity: 0.95}, 300);
		jQuery('#socialdrawer img').show();
	});
	//leave
	st.mouseleave(function(){
		st.animate({height:'20px', width: '40px', opacity: .7}, 300);
		jQuery('#socialdrawer img').hide();
		return false;
	});

	$("#dropdown-menu li a").css({'color':'#000'});
});

$('.add-to-cart').on('click',function (e) {
	alert_add_cart(); //linked from cartfuncjs.js
	//***** NEED TO CHECK FOR DUPLICATE ITEMS IN CART

	var product_id = e.target.id;
	var cart_title = $("#p_title"+ product_id).html();
	var cart_image = "http://localhost:8000/dropshipping/static/images/Product/" + $("#p_img"+ product_id).html() + ".jpg";
	var cart_desc = $("#p_desc"+ product_id).html();
	var cart_price = $("#p_price"+ product_id).html();
	if(cart_desc == undefined){
		cart_desc = ''
		// return false
	}

	$("#pop_img").html('<img src="'+cart_image+'" alt="Owl Image" width="100%"/>');
	$("#pop_title").html('<h2>'+cart_title+'</h2>');
	$("#pop_desc").html('<h4>'+ cart_desc+'</h4>');
	//$("#pop_rating").html();
	$("#pop_price").html('<h3>'+ cart_price+'</h3>');

	var qty = 1  // Change it later
	 $.ajax({
		 type: "POST",
		 url: "/Dropshipping/default/add_to_cart?product_id="+product_id+"&qty="+qty,
	 });
	var current_num = parseInt( $('#cart_number').html() );
	$('#cart_number').html(current_num+1);
	insert_cart_dropdown()
});

$('document').ready(function (e) {
	insert_cart_dropdown()
})

function insert_cart_dropdown(){
	$.ajax({
		 type: "POST",
		 url: "/Dropshipping/default/get_cart_content",
	 }).done(function (html) {
		html = JSON.parse(html)
		html = html['html']
		console.log(html['html'])
		$("#cart_ul").html('');
		$("#cart_ul").html(html);
	})

	// var cart_title = $("#p_title"+ product_id).html();
	// var cart_image = "http://localhost:8000/dropshipping/static/images/Product/" + $("#p_img"+ product_id).html() + ".jpg";
    //
	// $("#cart_ul").prepend('<li style="padding: 10px; border-bottom: 1px solid #ededed;"><img width="30px" height="30px" style="padding:5px;" src='+cart_image+'/><div style="padding:2px;">1</div>'+cart_title+'</li>');

}

$('#cart_icon').on('click',function () {
	window.location.href = './checkout'
});

function load_cart_number() {
	$.ajax({
		 type: "POST",
		 url: "/Dropshipping/default/get_number_of_items_in_cart"
	 }).done(function (e) {
		 respond =  JSON.parse(e);
		 $('#cart_number').html(respond['total'])
	});
}

$('.logo-container').on('click',function (e) {
	window.location.href = '/Dropshipping/default';
})


function remove_from_cart(pid,qty){
    var current_num = $('#cart_number').html();
	current_num = parseInt(current_num) - parseInt(qty);
	$('#cart_number').html(current_num);
	console.log('#order_id_'+pid)
	$('#order_id_'+pid).fadeOut(800);
	$.ajax({
		 type: "POST",
		 url: "/Dropshipping/default/remove_from_cart?product_id="+pid
	 }).done(function () {
		$.ajax({
		 type: "POST",
		 url: "/Dropshipping/default/get_total_cart_price_json"
	 }).done(function (respond) {
			console.log(respond)
			respond = JSON.parse(respond)
			$('#total_price').html(respond['total_price'])
		}).done(function () {
			$.ajax({
		 		type: "POST",
		 		url: "/Dropshipping/default/get_number_of_items_in_cart"
	 		}).done(function (respond) {
				insert_cart_dropdown()
				respond = JSON.parse(respond)
				console.log(respond)
				$('#number_of_items').html(respond['total'])

			})
			
		})
	})
}

$('#check_product_payment input.required_card_num').on('keyup',function (e) {
	if(e.which == 37 || e.which == 39) return
	var raw_card_num = $('#'+e.target.id).val();
	var valid = raw_card_num.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
	if(valid.length >= 2 ) {
		var first_two = valid.match(/(^[0-9]{2})/)
		if(first_two[0] == '34' || first_two[0] == '37'){
			valid = valid.slice(0,15);
			if(valid.length > 4 && valid.length < 11){
				var number = valid.slice(0,4) + ' - ' + valid.slice(4,valid.length)
			}
			if(valid.length >= 11){
				var number = valid.slice(0,4) + ' - ' + valid.slice(4,10) + ' - ' + valid.slice(10,valid.length)
			}
			if(valid.length == 15){
				$('#cc_number').removeClass('invalid');
				$('#cc_number').addClass('valid');
				$('#err_cc_number').html('');
			}else{
				$('#cc_number').removeClass('valid');
			}
		}else{
			valid = valid.slice(0,16);
			if(valid.length >= 4 && valid.length < 8){
				var number = valid.slice(0,4) + ' - ' + valid.slice(4,valid.length)
			}
			if(valid.length >= 8 && valid.length <= 12){
				var number = valid.slice(0,4) + ' - ' + valid.slice(4,8) + ' - ' + valid.slice(8,12)
			}
			if(valid.length > 12){
				var number = valid.slice(0,4) + ' - ' + valid.slice(4,8) + ' - ' + valid.slice(8,12) + ' - ' +valid.slice(12,16)
			}
			if(valid.length == 16){
				$('#cc_number').removeClass('invalid');
				$('#cc_number').addClass('valid');
				$('#err_cc_number').html('');
			}else{
				$('#cc_number').removeClass('valid');
			}
		}
	}
	if(typeof number != 'undefined'){
		$('#'+e.target.id).val( number );
	}else{
		$('#'+e.target.id).val( valid );
	}
});

$('#check_product_payment input.required').focusout(function (e) {
	$id = e.target.id;
	// console.log($id)
	switch ($id){
		case 'zip':
			$zip = $('#'+$id).val();
			var $zip_validation = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($zip);
			if($zip_validation){
				$('#'+$id).removeClass('invalid');
				$('#'+$id).addClass('valid');
				$('#err_zip').html('');
			}else{
				$('#err_zip').html('Not a valid ZIP code');
				$('#'+$id).removeClass('valid');
				$('#'+$id).addClass('invalid');
			}
			break;
		case 'email':
			$email = $('#'+$id).val();
			var $email_validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($email);
			if($email_validation){
				$('#'+$id).removeClass('invalid');
				$('#'+$id).addClass('valid');
				$('#err_'+$id).html('');
			}else{
				$('#err_'+$id).html('Not a valid Email address');
				$('#'+$id).removeClass('valid');
				$('#'+$id).addClass('invalid');
			}
			break;
		case 'cvv':
			$cvv = $('#'+$id).val();
			var $validation = /^[0-9]{3,4}$/.test($cvv);
			if($validation){
				$('#err_'+$id).html('');
				$('#'+$id).removeClass('invalid');
				$('#'+$id).addClass('valid');
			}else{
				$('#err_'+$id).html('Not a valid CVV code')
				$('#'+$id).removeClass('valid');
				$('#'+$id).addClass('invalid');
			}
			break;
		default:
			$value = $('#'+$id).val();
			var $validation = /[a-zA-Z0-9]+/.test($value);
			if($validation){
				$('#'+$id).removeClass('invalid');
				$('#'+$id).addClass('valid');
				$('#err_'+$id).html('')
			}else{
				$('#err_'+$id).html('Required field')
				$('#'+$id).removeClass('valid');
				$('#'+$id).addClass('invalid');
			}
			break;
	}
});

$('input#checkout_btn').on('click',function (e) {
	var count = $('#check_product_payment').find('.valid').length ;
	var cart_id = $('#cart_id').val();
	if(parseInt( $('#cart_number').html() ) == 0){
		$('#err_email').html('Your shopping cart is empty');
		return false;
	}
	if(count == 8){
		var city = '';
		var state = '';
		$.ajax({
			method: 'POST',
			url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+$('#zip').val()+'&sensor=true',
			async: true,
		}).done(function (respond) {
			city = respond['results'][0]['address_components'][1]['long_name']
			state = respond['results'][0]['address_components'][3]['short_name']
			var $customer_info = {
				'full_name': encodeURIComponent($('#full_name').val()),
				'address1': encodeURIComponent($('#address1').val()),
				'address2' : encodeURIComponent($('#address2').val()),
				'city': city,
				'state' : state,
				'zip': encodeURIComponent($('#zip').val()),
				'card_number': encodeURIComponent($('#cc_number').val()),
				'month' : encodeURIComponent($('#cc_exp_month').has(':selected').val()),
				'year' : encodeURIComponent($('#cc_exp_year').has(':selected').val()),
				'name_on_card' : encodeURIComponent($('#cc_name').val()),
				'cvv' : encodeURIComponent($('#cvv').val()),
				'email' : encodeURIComponent($('#email').val()),
			}
			console.log($customer_info);
			var jsonString = JSON.stringify($customer_info);
			$.ajax({
				method: 'POST',
				url: '/Dropshipping/default/create_purchase_order?full_name='+$customer_info['full_name']+'&address1='+$customer_info['address1']+'&address2='+$customer_info['address2']+'&city='+$customer_info['city']+'&state='+$customer_info['state']+'&zip='+$customer_info['zip']+'&card_number='+$customer_info['card_number']+'&month='+$customer_info['month']+'&year='+$customer_info['year']+'&name_on_card='+$customer_info['name_on_card']+'&cvv='+$customer_info['cvv']+'&email='+$customer_info['email'],
				async: true,
			})

		})

	}else{
		show_validation()
	}
});

function show_invoice() {
	console.log('show invoce is called')
}

function show_validation() {
	var fields = ['full_name','address1','city','zip','cc_name','cc_number','cvv','email'];
	for(i=0;i<fields.length;i++){
		if(!$('#'+fields[i]).hasClass('valid')){
			$('#err_'+fields[i]).html('Required field')
			$('#'+fields[i]).addClass('invalid');
		}
	}
}

function check_email_validation($id){
	$email = $('#'+$id).val();
	var $email_validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if($email.match($email_validation)){
		return true;
	}else{
		return false;
	}
}

$(document).mouseup(function (e)
{
    var container = $("#cart_alert");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        close_add_cart();
    }
});

function save_review(product_id) {
	var name = $('#add_review_name').val();
	var review = $('#customer_review_txt').val();
	var stars = parseInt( $('input[name="rank"]:checked').val() );
	if(isNaN(stars)){
		$('#error_show').html('<h3>Make sure you enter a rank before submiting your review</h3>');
		return false;
	}
	console.log(stars)
	if(name == '' || review == ''){
		$('#error_show').html('<h3>Make sure you enter your name and  your review before submit</h3>');
		return false;
	}else{
		$('#error_show').html('');
	}
	$.ajax({
			method: 'POST',
			url: '/Dropshipping/default/add_review?product_id='+product_id+'&review='+review+'&stars='+stars+'&name='+name,
			async: true,
		}).done(function (e) {
			$element = "<div id='review-container'>";
			$element+= "<div class='reviewer-name'><h4>"+name+"</h4></div>";
			for(i=0;i<stars;i++){
				$element+= "<img alt='star, yellow icon' class='tiled-icon' style='max-width: 20px; max-height: 20px;' src='https://cdn0.iconfinder.com/data/icons/super-mono-reflection/yellow/star_yellow.png'>";
			}
			$element+= "<div class='review-description'>"+review+"</div></div>";
			$('#error_show').css('color','green');
			$('#error_show').html('<h3>Your Review has been saved successfully</h3>');
			$('#add_review_container').fadeOut('fast')
			$('#review-container').before($element)

	})
}