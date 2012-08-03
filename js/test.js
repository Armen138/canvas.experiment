

function makeCanvas(w, h) {
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: context };
}


function displayStuff(img) {
	gameView(800, 800);
	game.canvas.addEventListener("mouseup", function(e) {
		console.log(e.button);
		if(e.button === 0) {
		    game.selectedUnits.each(function() {
		        this.go(game.map.at(e.clientX, e.clientY));
		    });
		    game.units.each(function() {
		        this.click(e.clientX, e.clientY);
		    });
		} else {
		    game.selectedUnits.each(function() {
		        this.deselect();
		    });
		    game.selectedUnits.clear();

		}
		return false;
	});	
	for( var i = 0; i < 5; i++) {
		game.addUnit(10 + i, 10);	
	}	
	render();
	/*setInterval(function() {
		game.units.each(function() {
			this.update();
		});
	}, 32);*/
}

function render() {
	//game.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	game.frames++;
	game.root.each(function() {
		this.draw();
	});
    //if(window.webkitRequestAnimationFrame) {
	//	webkitRequestAnimationFrame(render);
    //} else {
    	setTimeout(render, 5);
    //}
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
		game.canvas = makeCanvas(800, 800).canvas;
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

