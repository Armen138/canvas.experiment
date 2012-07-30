game = {
	root: ns.Node(),
	count: 0,
	frames: 0,
	fps: 0,

};

function noiseMap(w, h, res, lvl) {
	var map = [],
		noise = new SimplexNoise();	
	for(var x = 0; x < w; x++) {
		map[x] = [];
		for(var y = 0; y < h; y++) {			
			map[x][y] = parseInt((((noise.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
		}
	}	
	return map;
};
function makeCanvas(w, h) {
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: context };
}
function baseTerrain(w, h, color) {
	var d = makeCanvas(w, h);		
	d.context.fillStyle = color.toString();	
	d.context.fillRect(0, 0, w, h);
	color.mul(0.8);
	d.context.fillStyle = color.toString();
	for(var i = 0; i < w / 4; i++) {
		var x = Math.random() * w | 0;
		var y = Math.random() * h | 0;		
		d.context.fillRect(x, y, Math.random() * 4 | 0, Math.random() * 4 | 0);
	}
	return d.canvas;
};

function noised(w, h, res, lvl, color) {
	var resolution = res || 10,
		noise = new SimplexNoise();
	var c = makeCanvas(w, h);
	var noisedImage = c.context.createImageData(w, h);
	var basecolor = color || bt.Color("#11A600");	
	var levels = lvl || 3;
	
	for(var x = 0; x < w; x++) {
		for(var y = 0; y < h; y++) {
			var shade = parseInt((((noise.noise(x / resolution, y / resolution) + 1 )/ 2)  * levels), 10) * (256 / levels);			
			noisedImage.data[(x * 4) + (y * (w * 4))] = basecolor.red / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (w * 4)) + 1] = basecolor.green / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (w * 4)) + 2] = basecolor.blue / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (w * 4)) + 3] = 255;
		}
	}

	c.context.putImageData(noisedImage, 0, 0);
	return c.canvas;
};

function displayStuff(img) {

    //var tileSet = ts.TileSet();
    //game.root.add(tileSet);    
    var tile = ts.Tile(noised(400, 400, 120, 7, bt.Color("#FFF")));
    var tiles = [
    	/*noised(64, 64, 6, 20, bt.Color("#11A600")),
    	noised(64, 64, 6, 20, bt.Color("#CCE010")),
    	noised(64, 64, 6, 20, bt.Color("#E6DFC8")),
    	noised(64, 64, 6, 20, bt.Color("#7A6212"))*/
    	baseTerrain(64, 64, bt.Color("#618C32")),
    	baseTerrain(64, 64, bt.Color("#CCE010")),
    	baseTerrain(64, 64, bt.Color("#E6DFC8")),
    	baseTerrain(64, 64, bt.Color("#7A6212"))

    ];
    //tile.scale = bt.Vector(10, 10);
    tile.position = bt.Vector(400, 300);
    game.root.add(tile);
    for(var i = 0; i < tiles.length; i++) {
    	var t = ts.Tile(tiles[i]);
    	t.position = bt.Vector(64 * i + 32, 32);
    	game.root.add(t);
    }
    var tileSet = ts.TileSet(tiles, noiseMap(100, 100, 40, 4));
    game.root.add(tileSet);    

	render();
}

function render() {
	//game.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
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
		game.canvas = makeCanvas(window.innerWidth, window.innerHeight).canvas;
		document.body.appendChild(game.canvas);
	}
	game.context = game.canvas.getContext("2d");
};

window.addEventListener("load", function() {
	/*qdip.on("load", function() {
		displayStuff(qdip.images["face"]);
	});
	qdip.on("progress", function(file) {
		console.log("Loaded: " + file);
	});
	game.makeCanvas();
	qdip.load( { 
		tiles: "img/colorful.png"
	});*/
	game.makeCanvas();
	displayStuff();	
});
