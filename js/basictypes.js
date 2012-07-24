/* bt (Basic Types) depends on ns (nodes) for pooling */

/*  ns.Vector inherits from ns.Pooled through Object.create. 
	In addition, it checks if a discarded object is available,
	and returns it instead of a new instance
*/
var bt = {};
bt.Vector = function(x, y) {
	"use strict";	
	var vector = ns.Pooled.pull("vector");
	if(!vector) {	
		vector = Object.create(ns.Pooled(), {
			add: { value: function(other) { return bt.Vector(vector.X + other.X, vector.Y + other.Y); }},
			subtract: { value: function(other) { return bt.Vector(vector.X - other.X, vector.Y - other.Y); }},
			multiply: { value: function(other) { return bt.Vector(vector.X * other.X, vector.Y * other.Y); }},
			divide: { value: function(other) { return bt.Vector(vector.X / other.X, vector.Y / other.Y); }},
			type: { value: "vector" }
		});
	}
	vector.X = x || 0;
	vector.Y = y || 0;	
	return vector;
};