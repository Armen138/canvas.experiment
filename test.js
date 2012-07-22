game = {
	root: ns.Node(),
	count: 0,
	frames: 0,
	fps: 0,

};


function displayStuff(img) {
    /*for(var x = 0; x < window.innerWidth; x += img.width) {
        for(var y = 0; y < window.innerHeight; y += img.height) {
            var t = ts.Tile(img);
            t.position = bt.Vector(x, y);
            game.root.add(t);
            game.count++;
        }
    }*/
    var tileSet = ts.TileSet();
    game.root.add(tileSet);
	render();
}

function render() {
	//ns.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
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
		face: "face1.png",
		face2: "face2.png",
		face3: "face3.png",
		face4: "face4.png",
		brick: "brick.png",
		brick2: "brick2.png",
		brick3: "brick3.png"
	});	
});
