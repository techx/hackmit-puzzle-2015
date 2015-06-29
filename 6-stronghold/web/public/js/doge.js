var colors = ['white', 'magenta', 'yellow', 'black', 'blue', 'cyan', 'green', 'purple', 'red'];

setInterval(function(){
  var nodes = document.body.children;

  var w = window.innerWidth;
  var h = window.innerHeight;

  for (var i =0; i < nodes.length; i++){
    var node = nodes[i];

    var r_w = Math.random() * w + 'px';
    var r_h = Math.random() * h + 'px';
    var r_z = Math.random() * 100;


    var translate = "translate3d(" + r_w + "," + r_h + ", 0)";
    node.style.transform = translate;

    var color = colors[Math.floor(Math.random() * colors.length)];
    node.style.color = color;

    node.style.fontSize = (Math.random() * 80 + 24) + 'px';
  }

  var color = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = color;

}, 3000);
