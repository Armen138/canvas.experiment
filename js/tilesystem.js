/*	
	ts tile system. A way to organise tiles to render in an orthographic way. Requeres ns (nodes), bt (basictypes)
	and lucidJS for events. 
*/
var ts = {};

ts.Tile = function(img) {
	"use strict";
	var tile = ns.Pooled.pull("tile"),
		tileIndex = 0,
		tileSize = [64, 64],
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
					//draw = [image, X, Y, tileSize[WIDTH], tileSize[HEIGHT], position.X - tileSize[WIDTH] / 2, position.Y - tileSize[HEIGHT] / 2, tileSize[WIDTH], tileSize[HEIGHT]];		
					draw = [image, X, Y, tileSize[WIDTH], tileSize[HEIGHT], - tileSize[WIDTH] / 2, - tileSize[HEIGHT] / 2, tileSize[WIDTH], tileSize[HEIGHT]];		
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
	var gridSize = Math.sqrt(map.length) | 0;	
	var tileSet = Object.create(ns.Node(), {
			draw: {
				value: function() {
					tileSet.each(function() {
						this.draw();
					});
				}
			}
		}),
		tiles = ns.Node(),
		cache = (function() { var c = document.createElement("canvas"); c.width = game.canvas.width; c.height = game.canvas.height; return c;}()),
		cacheTile = ts.Tile(cache),
		context = cache.getContext("2d");

    for(var x = 0; x < gridSize; x++) {
        for(var y = 0; y < gridSize; y++) {
        	var idx = map[x + y * gridSize];//Math.floor(Math.random() * 4.0),
            	t = ts.Tile(tilearray[idx]);
            	console.log(t);
            t.position = bt.Vector(x * 64, y * 64);         
            //t.index = idx;   
            tiles.add(t);
            game.count++;
        }
    }
    tiles.each(function() {
    	this.draw(context);
    });
    cacheTile.position = bt.Vector(cache.width / 2, cache.height / 2);
    tileSet.add(cacheTile);
	return tileSet;	
}