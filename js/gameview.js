function gameView(w, h) {    
    var c = makeCanvas(w, h);
    gameView.canvas = c.canvas;
    gameView.context = c.context;
    gameView.width = w;
    gameView.height = h;

    var tiles = [
    	/*procedural.noise(tileSize, tileSize, 6, 20, bt.Color("#11A600")),
    	procedural.noise(tileSize, tileSize, 6, 20, bt.Color("#CCE010")),
    	procedural.noise(tileSize, tileSize, 6, 20, bt.Color("#E6DFC8")),
    	procedural.noise(tileSize, tileSize, 6, 20, bt.Color("#7A6212"))*/
    	procedural.terrain(tileSize, tileSize, bt.Color("#618C32")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#CCE010")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#E6DFC8")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#7A6212"))

    ];
    gameView.map = ts.TileSet(tiles, procedural.noiseMap(100, 100, 40, 4), gameView.canvas, w, h);
    game.mousePosition = bt.Vector(0, 0);
    document.addEventListener("mousemove", function(e) {
    	game.mousePosition.X = e.clientX;
    	game.mousePosition.Y = e.clientY;
    });
    game.root.add(gameView);
    var unit = Unit(10, 10);
    game.canvas.addEventListener("click", function(e) {
        unit.go(e.clientX, e.clientY);
    });
    game.root.add(unit);
    console.log(gameView.map.height);
    gameView.map.draw();
	setInterval(gameView.scrollHandler, 32);
}

gameView.draw = function() {
    
    game.context.drawImage(gameView.canvas, 0 ,0);
}
gameView.map = null;
gameView.scrollHandler = function() {
    if(!gameView.map) return;
    if(game.mousePosition.X < tileSize * 2)
        if(gameView.map.offset.X > 0) gameView.map.horizontal(1); 
    if(game.mousePosition.X > gameView.width - tileSize * 2)
        if(gameView.map.offset.X < gameView.map.width - gameView.width / tileSize) gameView.map.horizontal(-1);
    if(game.mousePosition.Y < tileSize * 2)
        if(gameView.map.offset.Y > 0) gameView.map.vertical(1);//gameView.map.offset.Y--;
    if(game.mousePosition.Y > game.canvas.height - tileSize * 2)
        if(gameView.map.offset.Y < gameView.map.height - ((game.canvas.height / tileSize + .5) | 0)) gameView.map.vertical(-1);//gameView.map.offset.Y++;
};

