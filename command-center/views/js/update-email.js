window.onload = function(){
    document.getElementById("update-email").onclick = function(event){
        event.preventDefault();
        makeGuess();
    }

    document.forms[0].onsubmit = function(event){
        event.preventDefault();
        makeGuess();
    }

    var makeGuess = function(){
        if (!document.forms[0].email.value.trim()){
            return;
        }
        var xmlhttp = new XMLHttpRequest();
        var email = document.forms[0].email.value;
        xmlhttp.open("POST", "/puzzle/user?email=" + email, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200 || xmlhttp.status == 201) { 
                    var correct = JSON.parse(xmlhttp.responseText).correct;
                    if (correct){
                        window.location = '/';
                    } 
                } else {
                    document.getElementById("error").innerHTML 
                        = JSON.parse(xmlhttp.responseText).error;
                }
            }
        };
        
        xmlhttp.send();
    }
}