// author kimberli
window.onload = function() {
	var content = document.getElementById("content");
	var target = document.getElementById("click-target");
	var pic = document.getElementById("picture");
	var song = document.getElementById("song");
	var bark = document.getElementById("bark");
	var playing = false;
	var barking = false;
	var textElements = [];
	var maxAngle = 45;
	var colors = ["white", "blue", "aqua", "orange", "lime", "yellow", "fuchsia", "red"];
	var comments = ["wow","wow","wow","wow","wow","wow","wow","wow","wow","wow","wow","wow","wow","such doge","so hack","much woof","very click","such javashibe","shibe","many css","very html","wow dom","very algorithme","such programe","so intershibe","very wonder","many bark","such song","much talent","much puzzle","amaze","such confuse","how to hack","so analyze","such fierce","very protect"];

	function makeElement() {
		var element = document.createElement('div');
		element.textContent = "wow";
		element.textContent = comments[Math.round(Math.random() * comments.length)]
		element.setAttribute("class", "dogespeak");
		var colorInt = Math.round(Math.random() * colors.length)
		element.style.color = colors[colorInt];
		place(element);
		rotate(element);
		content.insertBefore(element,content.firstChild)
	}

	function place(element) {
		element.style.position = "absolute";
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 100;
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100;
		var t = Math.random() * h + 25;
		var l = Math.random() * w;
		element.style.top = t + "px";
		element.style.left = l + "px";
	}

	function rotate(element) {
		var deg = Math.random() * maxAngle;
		if (Math.random() < 0.5) {
			deg *= -1;
		}
		element.style.webkitTransform = 'rotate('+deg+'deg)'; 
	    element.style.mozTransform = 'rotate('+deg+'deg)'; 
	    element.style.msTransform = 'rotate('+deg+'deg)'; 
	    element.style.oTransform = 'rotate('+deg+'deg)'; 
	    element.style.transform = 'rotate('+deg+'deg)'; 
	}

	target.addEventListener("click",function() {
		if (playing === false) {
			pic.src="doge2.jpg";
			song.play();
			makeElement();
			playing = true;
			barking = true;
			setTimeout(function(){
				pic.src="doge1.jpg";
				barking = false;
			},500);
		}
		else if (barking == false) {
			bark.play();
			barking = true;
			makeElement();
			pic.src="doge2.jpg";
			setTimeout(function(){
				pic.src="doge1.jpg";
				barking = false;
			},500);
		}
	});

	song.addEventListener("ended", function() {
		playing = false;
	});
};