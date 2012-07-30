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

bt.Color = function(input) {
	"use strict";
	var r, g, b;
	if(input[0] === '#') {
		if(input.length === 4) {
			r = (parseInt(input[1], 16) + 1) * 16;
			g = (parseInt(input[2], 16) + 1) * 16;
			b = (parseInt(input[3], 16) + 1) * 16;
		} else {
			r = (parseInt(input.substr(1, 2), 16) + 1);
			g = (parseInt(input.substr(3, 2), 16) + 1);
			b = (parseInt(input.substr(5, 2), 16) + 1);
		}
	}
	return Object.create(ns.Pooled(),{
		array: {
			get: function() {
				return [r, g, b];
			},
			set: function(a) {
				r = a[0];
				g = a[1];
				b = a[2];
			}
		},
		red: {
			get: function() { return r; },
			set: function(red) { r = red; }
		},
		green: {
			get: function() { return g; },
			set: function(green) { g = green; }
		},
		blue: {
			get: function() { return b; },
			set: function(blue) { b = blue; }
		},
		toString: {
			value : function() {
			return "rgba(" + r + "," + g + "," + b + ",1.0)" }
		},
		mul: {
			value: function(x) { 
			r = r * x | 0;
			g = g * x | 0;
			b = b * x | 0; }
		}		
	});
};
