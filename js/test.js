game = {
	root: ns.Node(),
	count: 0,
	frames: 0,
	fps: 0,

};

function noised() {
	var width = 500,
		height = 500,
		resolution = 128,
		noise = new SimplexNoise();
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");		
	var noisedImage = context.createImageData(width, height);
	console.log(noisedImage.data.length);
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			var shade = parseInt(((noise.noise(x / resolution, y / resolution) + 1) * 127), 10);
			//console.log(shade);
			noisedImage.data[(x * 4) + (y * (width * 4))] = shade;
			noisedImage.data[(x * 4) + (y * (width * 4)) + 1] = shade;
			noisedImage.data[(x * 4) + (y * (width * 4)) + 2] = shade;
			noisedImage.data[(x * 4) + (y * (width * 4)) + 3] = 255;
		}
	}

	context.putImageData(noisedImage, 0, 0);
	return canvas;
};

function displayStuff(img) {
    //var tileSet = ts.TileSet();
    //game.root.add(tileSet);
    var tile = ts.Tile(noised());
    //tile.scale = bt.Vector(10, 10);
    tile.position = bt.Vector(250, 250);
    game.root.add(tile);
	render();
}

function render() {
	//ns.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	game.frames++;
	game.root.each(function() {
		this.draw();
	});
    if(window.webkitRequestAnimationFrame) {
		webkitRequestAnimationFrame(render);
    } else {
    	setTimeout(render, 5);
    }
}
if(!navigator.isCocoonJS) {
	setInterval(function() {
		game.fps = game.frames;	
	    document.getElementById("fps").innerHTML = game.fps + " :: " + game.count;
		game.frames = 0;	
	}, 1000);
}

game.makeCanvas = function() {
	game.canvas = document.getElementById("game");
	if(!game.canvas) {
		game.canvas = document.createElement("canvas");
		game.canvas.width = window.innerWidth;
		game.canvas.height = window.innerHeight;
		document.body.appendChild(game.canvas);
	}
	game.context = game.canvas.getContext("2d");
};

window.addEventListener("load", function() {
	qdip.on("load", function() {
		displayStuff(qdip.images["face"]);
	});
	qdip.on("progress", function(file) {
		console.log("Loaded: " + file);
	});
	game.makeCanvas();
	qdip.load( { 
		tiles: "img/colorful.png"
	});	
});

console.log(LZW.compress("function SimplexNoise(){function u(e,t,n){return e.X*t+e.Y*n}function a(t,n,r,i){return t<0?0:Math.pow(t,4)*u(e[n],r,i)}var e=[bt.Vector(1,1),bt.Vector(-1,1),bt.Vector(1,-1),bt.Vector(-1,-1),bt.Vector(1,0),bt.Vector(-1,0),bt.Vector(1,0),bt.Vector(-1,0),bt.Vector(0,1),bt.Vector(0,-1),bt.Vector(0,1),bt.Vector(0,-1)],t=[],n=[],r=[],i,s=.5*(Math.sqrt(3)-1),o=(3-Math.sqrt(3))/6;for(i=0;i<512;i++)t.push(Math.floor(Math.random()*255)),n.push(t[i&255]),r.push(n[i]%12);this.noise=function(e,t){var i=(e+t)*s,u=e+i|0,f=t+i|0,l=(u+f)*o,c=e-(u-l),h=t-(f-l),p,d,v,m,g,y,b,w,E,S,x,T;return c>h?(p=1,d=0):(p=0,d=1),v=c-p+o,g=h-d+o,m=c-1+2*o,y=h-1+2*o,b=u&255,w=f&255,E=r[b+n[w]],S=r[b+p+n[w+d]],x=r[b+1+n[w+1]],T=a(.5-c*c-h*h,E,c,h)+a(.5-v*v-g*g,S,v,g)+a(.5-m*m-y*y,x,m,y),70*T}}"));