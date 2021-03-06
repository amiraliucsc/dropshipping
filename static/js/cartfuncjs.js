/**
 * Created by RedBox on 11/27/2016.
 */
function alert_add_cart(message){
    $("body").append(
        "<div id='overlay' style='background-color: #000000; position:absolute; top:0; left:0; height:100%; width:100%; z-index:9; opacity:0.7;'></div>"
    );
    $("#inner_cart_alert").html(message);
    $("#cart_alert").css({'z-index':'10','display':'flex'});
    $("#cart_alert").fadeIn(1000);
}

function close_add_cart(){
    $("#cart_alert").fadeOut(0);
    $("#overlay").remove();
}

var search_on=false;
function enable_search_input(){
    if(search_on){
        $("#search_box").css({'display':'none'});
        search_on = false;
    }else{
        $("#search_box").css({'display':'inline'});
        $("#search_input").focus();
        search_on = true;
    }
}

function search_category(opt, force){
    var search_term;
    if(force){
        search_term = force.replace(/'/g, "");
    }else{
        search_term = (document.querySelector('[name="search_input"]').value).replace(/'/g, "");
    }

    console.log(search_term, opt);
    window.location.href = '/Dropshipping/default/products?search_string='+search_term+'&opt='+opt;
}