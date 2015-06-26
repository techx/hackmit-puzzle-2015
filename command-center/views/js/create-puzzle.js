window.onload = function(){
    document.getElementById("start-button").onclick = function(event){
        event.preventDefault();
        createNewPuzzle();
    }

    var createNewPuzzle = function(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/puzzle", true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200 || xmlhttp.status == 201) {  
                    window.location = '/';
                } else {
                    document.getElementById("error").innerHTML = "Oops, something went wrong.";
                }
            }
        };
        xmlhttp.send();
    }
}