/**
 * Created by RedBox on 11/27/2016.
 */
function alert_add_cart(){
    //$("#cart_alert").css({'z-index':'3'});
    $("#cart_alert").fadeIn(1000);
}

function close_add_cart(){
    $("#cart_alert").fadeOut(0);
}

(function(){
    $("#cart_alert").fadeOut(0);
})();