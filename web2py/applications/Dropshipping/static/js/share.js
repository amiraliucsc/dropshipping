
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
});


$('document').ready(function () {
	load_cart_number();
});

$('.add-to-cart').on('click',function (e) {
	var product_id = e.target.id;
	var qty = 1  // Change it later
	 $.ajax({
		 type: "POST",
		 url: "/Dropshipping/default/add_to_cart?product_id="+product_id+"&qty="+qty,
	 })
	var current_num = parseInt( $('#cart_number').html() );
	$('#cart_number').html(current_num+1);
});

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
				$('#err_zip').html('Not a valid ZIP code')
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
		var $customer_info = {
			'full_name': $('#full_name').val(),
			'address1': $('#address1').val(),
			'address2' : $('#address2').val(),
			'city': $('#city').val(),
			'zip': $('#zip').val(),
			'card_number': $('#cc_number').val(),
			'month' : $('#cc_exp_month').has(':selected').val(),
			'year' : $('#cc_exp_year').has(':selected').val(),
			'name_on_card' : $('#cc_name').val(),
			'cvv' : $('#cvv').val(),
			'email' : $('#email').val(),
			'cart_id' : cart_id

		};
		var jsonString = JSON.stringify($customer_info);
		$.ajax({
			method: 'POST',
			url: '/purchasing/submit_order',
			async: true,
			data: {
				data : jsonString
			}
		})
			.done(function (respond) {
				respond = jQuery.parseJSON(respond);
				if(respond['stock_check'] == 'oos'){
					out_of_stock_error(respond['oos_items']);
				}
			});

	}else{
		show_validation()
	}
});


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