game = {
	root: ns.Node(),
	count: 0,
	frames: 0,
	fps: 0,

};


function displayStuff(img) {
    var tileSet = ts.TileSet();
    game.root.add(tileSet);
	render();
}

function render() {
	game.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	game.frames++;
	game.root.each(function() {
		this.draw();
	});
    if(window.webkitRequestAnimationFrame) {
		webkitRequestAnimationFrame(render);
    } else {
    	setTimeout(render, 5);
    }
}
if(!navigator.isCocoonJS) {
	setInterval(function() {
		game.fps = game.frames;	
	    document.getElementById("fps").innerHTML = game.fps + " :: " + game.count;
		game.frames = 0;	
	}, 1000);
}

game.makeCanvas = function() {
	game.canvas = document.getElementById("game");
	if(!game.canvas) {
		game.canvas = document.createElement("canvas");
		game.canvas.width = window.innerWidth;
		game.canvas.height = window.innerHeight;
		document.body.appendChild(game.canvas);
	}
	game.context = game.canvas.getContext("2d");
};

window.addEventListener("load", function() {
	qdip.on("load", function() {
		displayStuff(qdip.images["face"]);
	});
	qdip.on("progress", function(file) {
		console.log("Loaded: " + file);
	});
	game.makeCanvas();
	qdip.load( { 
		face: "img/face1.png",
		face2: "img/face2.png",
		face3: "img/face3.png",
		face4: "img/face4.png",
		brick: "img/brick.png",
		brick2: "img/brick2.png",
		brick3: "img/brick3.png"
	});	
});
