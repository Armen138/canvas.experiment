var tileSize = 32,
    game = {
        tileSize: 32,
    	root: ns.Node(),
    	count: 0,
    	frames: 0,
    	selectedUnits: ns.Node(),
    	units: ns.Node(),
    	fps: 0,
        collisionMap: [],
        map: []
    };

game.addUnit = function(x, y) {
    var unit = Unit(x, y);
    game.selectedUnits.add(unit);
    game.units.add(unit);
    game.canvas.addEventListener("click", function(e) {
        game.selectedUnits.each(function() {
        	this.go(game.map.at(e.clientX, e.clientY));
        });
    });
    game.root.add(unit);
}