var pic = document.getElementById("picture");
var song = document.getElementById("song");
var bark = document.getElementById("bark");
var playing = false;
var count = 1;

pic.addEventListener("click",function() {
	if (!playing) {
		pic.style.backgroundImage="url('doge2.png')";
		var num = Math.random();
		if (count % 10 == 0) {
			song.play();
		}
		else {
			bark.play();
		}
		playing = true;
		count += 1;
	}
});

song.addEventListener("ended", function() {
	pic.style.backgroundImage="url('doge1.png')";
	playing = false;
})

bark.addEventListener("ended", function() {
	pic.style.backgroundImage="url('doge1.png')";
	playing = false;
})