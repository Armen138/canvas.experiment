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
						context.drawImage.apply(context, draw);
						tile.each(function() {
							this.draw(context);
						});
					}
				}
			},
			position: {
				set: function(pos) {
					position.release();
					position = pos;
					draw = [image, pos.X - image.width / 2, pos.Y - image.height / 2];
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
					var Y = parseInt(t / (image.width / tileSize[WIDTH]), 10) * tileSize[WIDTH];
					var X = parseInt(t % (image.width / tileSize[HEIGHT]), 10) * tileSize[WIDTH];					
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

ts.TileSet = function() {
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
	var img = [
		qdip.images.face,
		qdip.images.face2,
		qdip.images.face3,
		qdip.images.face4,
		qdip.images.brick,
		qdip.images.brick2,
		qdip.images.brick3
		];		
	//insert img 0 to 4 = picture	
    for(var x = 0; x < game.canvas.width; x += img[0].width) {
        for(var y = 0; y < game.canvas.height; y += img[0].height) {
        	var idx = Math.floor(Math.random() * 7.0),
            	t = ts.Tile(img[idx]);
            t.position = bt.Vector(x, y);            
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