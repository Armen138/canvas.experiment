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

ts.TileSet = function(tilearray, map, canvas, w, h) {
	console.log(tilearray);
	var gridSize = map.length,
		screenSize = bt.Vector(w / tileSize, h / tileSize),
		context = canvas.getContext("2d"),
		tileSet = Object.create(ns.Node(), {
			at: {
				value: function(x, y) {
					return bt.Vector((x / tileSize + tileSet.offset.X) | 0, (y / tileSize + tileSet.offset.Y) | 0);
				}
			},
			width: {
				value: map.length
			},
			height: {
				value: map[0].length
			},
			at: {
				value: function(x, y) {
					return bt.Vector((x / tileSize | 0)+ game.map.offset.X, (y / tileSize | 0) + game.map.offset.Y);
				}
			},
			horizontal: {
				value: function(d) {
					context.drawImage(canvas, tileSize * d, 0);
					tileSet.offset.X -= d;
					for(var y = 0 + tileSet.offset.Y; y < tileSet.offset.Y + screenSize.Y; y++) {
						var x = (d < 0 ? screenSize.X : 0) + tileSet.offset.X - (d < 0 ? 1 : 0);
						context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
					}
				}
			},
			vertical: {
				value: function(d) {
					context.drawImage(canvas, 0, tileSize * d);
					tileSet.offset.Y -= d;
					for(var x = 0 + tileSet.offset.X; x < tileSet.offset.X + screenSize.X; x++) {
						var y = (d < 0 ? screenSize.Y : 0) + tileSet.offset.Y - (d < 0 ? 1 : 0);
						context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
					}
				}
			},
			draw: {
				value: function() {
					if(tileSet.offset) {

						var br = tileSet.offset.add(screenSize);
						for(var x = tileSet.offset.X; x < br.X; x++) {
							for(var y = tileSet.offset.Y; y < br.Y; y++) {
								context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
							}
						}
						br.release();
						//screenSize.release();
					}
				}
			}
		});

    tileSet.offset = bt.Vector(0, 0);
	return tileSet;
}