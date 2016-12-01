/**
 * Created by RedBox on 11/27/2016.
 */
function alert_add_cart(){
    $("#cart_alert").css({'z-index':'10'});
    $("#cart_alert").fadeIn(1000);
}

function close_add_cart(){
    $("#cart_alert").fadeOut(0);
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