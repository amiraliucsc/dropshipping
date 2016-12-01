/**
 * Created by Victor Shahbazian on 11/30/2016.
 */
function send_contact_form(){
    var name_check = false;
    var email_check = false;
    var message_check = false;

    contact_name = document.querySelector('[name="contact_name"]').value;
    contact_email = document.querySelector('[name="contact_email"]').value;
    contact_message = document.querySelector('[name="contact_message"]').value;

    if(contact_name.length < 4 || contact_name.length > 16 ){
        //set error message on name
    }else{
        name_check = true;
    }

    if(contact_email.length < 4 || contact_email.length > 16){
        //set error message on name
    }else{
        var letters = /^[A-Za-z]+$/;
        var email_name = "";
        var at_check = false;
        for(var i=0; i<contact_email.length; i++){
            if(at_check != true) {
                if (contact_email[i] == '@') {
                    at_check = true;
                    console.log("@ verified");
                }
            }else{
                if(contact_email[i].value.match(letters)){
                    email_name += contact_email[i];
                }
            }
        }
        if(at_check == true){
            email_check = true;
        }
    }

    if(contact_message.length <= 0 || contact_message.length > 500){
        //set error message
    }else{
        message_check = true;
    }

    if(name_check && email_check && message_check){
        //send data to python
    }else{
        //return to contact page and display errors
    }
}