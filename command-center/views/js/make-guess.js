window.onload = function(){
    document.getElementById("submit-answer").onclick = function(event){
        event.preventDefault();
        makeGuess();
    }

    document.forms[0].onsubmit = function(event){
        event.preventDefault();
        makeGuess();
    }

    var makeGuess = function(){
        if (!document.forms[0].guess.value.trim()){
            return;
        }
        var xmlhttp = new XMLHttpRequest();
        var puzzleNumber = document.forms[0].puzzleNumber.value;
        var guess = document.forms[0].guess.value;
        xmlhttp.open("POST", "/puzzle/guess?puzzleNumber=" + puzzleNumber + "&guess=" + guess, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200 || xmlhttp.status == 201) { 
                    var correct = JSON.parse(xmlhttp.responseText).correct;
                    if (correct){
                        window.location = '/';
                    } else {
                        document.getElementById("feedback").innerHTML 
                        = "I don't think that's the right answer.";
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