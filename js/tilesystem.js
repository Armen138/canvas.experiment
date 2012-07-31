/*
	ts tile system. A way to organise tiles to render in an orthographic way. Requeres ns (nodes), bt (basictypes)
	and lucidJS for events.
*/
var ts = {};

ts.Tile = function(img) {
	"use strict";
	var tile = ns.Pooled.pull("tile"),
		tileIndex = 0,
		tilePosition = [0, 0],
		tileSize = [tileSize, tileSize],
		position = bt.Vector(),
		WIDTH = 0,
		HEIGHT = 1;
	if(!tile) {
		var image = img;
		var draw = [image, - image.width / 2, - image.height / 2];
		tile = Object.create(ns.Node(), {
			draw: {
				value: function(context) {
					context = context || game.context;
					if(tile.visible) {
						context.save();
						context.translate(position.X, position.Y);
						if(tile.scale) {
							context.scale(tile.scale.X, tile.scale.Y);
						}
						draw = [image, tilePosition[0], tilePosition[1], tileSize[WIDTH], tileSize[HEIGHT], - tileSize[WIDTH] / 2, - tileSize[HEIGHT] / 2, tileSize[WIDTH], tileSize[HEIGHT]];
						context.drawImage.apply(context, draw);
						tile.each(function() {
							this.draw(context);
						});
						context.restore();
					}
				}
			},
			position: {
				set: function(pos) {
					position.release();
					position = pos;
					//draw = [image, pos.X - image.width / 2, pos.Y - image.height / 2];
				},
				get: function() {
					return position;
				}
			},
			index: {
				get: function() {
					return tileIndex;
				},
				set: function(idx) {
					tileIndex = idx;
					var Y = parseInt(idx / (image.width / tileSize[WIDTH]), 10) * tileSize[WIDTH];
					var X = parseInt(idx % (image.width / tileSize[HEIGHT]), 10) * tileSize[WIDTH];
					tilePosition = [X, Y];
					draw = [image, X, Y, tileSize[WIDTH], tileSize[HEIGHT], tile.parent.offset.X - tileSize[WIDTH] / 2, tile.parent.offset.Y - tileSize[HEIGHT] / 2, tileSize[WIDTH], tileSize[HEIGHT]];
				}
			},
			image: {
				set: function(img) {
					image = img;
				}
			}
		});
	} else {
		tile.index = 0;
		tile.image = img;
	}
	tile.dimension = bt.Vector();
	LucidJS.emitter(tile);
	return tile;
};

ts.TileSet = function(tilearray, map) {
	console.log(tilearray);
	var gridSize = map.length;
	var tileSet = Object.create(ns.Node(), {
			width: {
				value: map.length
			},
			height: {
				value: map[0].length
			},
			draw: {
				value: function() {
					if(tileSet.offset) {
						var screenSize = bt.Vector(game.canvas.width / tileSize, game.canvas.height / tileSize);
						var br = tileSet.offset.add(screenSize);
						for(var x = tileSet.offset.X; x < br.X; x++) {
							for(var y = tileSet.offset.Y; y < br.Y; y++) {
								game.context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
							}
						}
						br.release();
						screenSize.release();
					}
				}
			}
		}),
		tiles = ns.Node(),
		cache = (function() { var c = document.createElement("canvas"); c.width = game.canvas.width; c.height = game.canvas.height; return c;}()),
		cacheTile = ts.Tile(cache),
		context = cache.getContext("2d");
    tileSet.offset = bt.Vector(0, 0);
    /* test test
    document.addEventListener("keyup", function() {
    	tileSet.offset.X++;
    	tileSet.offset.Y++;
    });*/
	return tileSet;
}