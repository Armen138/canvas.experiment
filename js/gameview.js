function gameView() {
	/*
	gameView.canvas = document.getElementById("game");
	if(!gameView.canvas) {
		gameView.canvas = makeCanvas(window.innerWidth, window.innerHeight).canvas;
		document.body.appendChild(game.canvas);
	}
	game.context = game.canvas.getContext("2d");	*/
    var tiles = [
    	/*noised(tileSize, tileSize, 6, 20, bt.Color("#11A600")),
    	noised(tileSize, tileSize, 6, 20, bt.Color("#CCE010")),
    	noised(tileSize, tileSize, 6, 20, bt.Color("#E6DFC8")),
    	noised(tileSize, tileSize, 6, 20, bt.Color("#7A6212"))*/
    	procedural.terrain(tileSize, tileSize, bt.Color("#618C32")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#CCE010")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#E6DFC8")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#7A6212"))

    ];	
    gameView.map = ts.TileSet(tiles, noiseMap(100, 100, 40, 4));
    game.mousePosition = bt.Vector(0, 0);
    document.addEventListener("mousemove", function(e) {
    	game.mousePosition.X = e.clientX;
    	game.mousePosition.Y = e.clientY;
    });
    game.root.add(gameView.map);    
	setInterval(gameView.scrollHandler, 32);	
}

gameView.map = null;
gameView.scrollHandler = function() {
	if(!gameView.map) return;
	if(game.mousePosition.X < tileSize * 2) {
		if(gameView.map.offset.X > 0) gameView.map.offset.X--;
	}
	if(game.mousePosition.X > window.innerWidth - tileSize * 2) {
		if(gameView.map.offset.X < 20) gameView.map.offset.X++;
	}		
};