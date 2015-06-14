var pic = document.getElementById("picture");
var song = document.getElementById("song");
var bark = document.getElementById("bark");
var playing = false;
var count = 1; // keep track of bark count
var repeat = 10; // number of times to bark before playing song

function playSound() {
	var num = Math.random();
	if (count % repeat == 0) {
		song.play();
	}
	else {
		bark.play();
	}
	playing = true;
	count += 1;
	console.log(count, playing);
}

function reset() {
	if (playing === true) {
		pic.style.backgroundImage="url('doge1.png')";
		playing = false;
		console.log(playing);
	}
}

pic.addEventListener("click",function() {
	if (playing === false) {
		pic.style.backgroundImage="url('doge2.png')";
		playSound();
	}
});

song.addEventListener("ended", function() {
	reset();
});

bark.addEventListener("ended", function() {
	reset();
});