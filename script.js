var pic = document.getElementById("picture");
var song = document.getElementById("song");
var playing = false;

pic.addEventListener("click",function() {
	if (!playing) {
		pic.style.backgroundImage="url('doge2.png')";
		song.play();
		playing = true;
	}
});

song.addEventListener("ended", function() {
	pic.style.backgroundImage="url('doge1.png')";
	playing = false;
})