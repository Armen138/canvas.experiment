game = {
	root: ns.Node(),
	count: 0,
	frames: 0,
	fps: 0,

};

function noised() {
	var width = 500,
		height = 500,
		resolution = 128,
		noise = new SimplexNoise();
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");		
	var noisedImage = context.createImageData(width, height);
	var basecolor = bt.Color("#FFF333");
	console.log(basecolor);
	var levels = 3;
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			var shade = parseInt((((noise.noise(x / resolution, y / resolution) + 1 )/ 2)  * levels), 10) * (256 / levels);
			//console.log(shade);
			noisedImage.data[(x * 4) + (y * (width * 4))] = basecolor.red / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (width * 4)) + 1] = basecolor.green / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (width * 4)) + 2] = basecolor.blue / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (width * 4)) + 3] = 255;
		}
	}

	context.putImageData(noisedImage, 0, 0);
	return canvas;
};

function displayStuff(img) {

    //var tileSet = ts.TileSet();
    //game.root.add(tileSet);
    var tile = ts.Tile(noised());
    //tile.scale = bt.Vector(10, 10);
    tile.position = bt.Vector(250, 250);
    game.root.add(tile);

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
	    document.getElementById("fps").innerHTML = game.fps;
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
		tiles: "img/colorful.png"
	});	
});

