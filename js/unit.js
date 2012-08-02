Unit = function(tx, ty) {
	var x = tx * tileSize, 
		y = ty * tileSize,
		path = [],
		angle = 1,
		targetAngle = 0,
		tileTime = 0,
		moveDuration = 100,
		color = "rgba(0, 200, 100, 1.0)",
		getAngle = function(x1, y1, x2, y2) {
			var diff = bt.Vector(x1 - x2, y1 - y2);
			if(diff.X < 0 && diff.Y < 0){ return 3 * Math.PI / 4; }
			if(diff.X === 0 && diff.Y < 0){ return Math.PI; }
			if(diff.X > 0 && diff.Y < 0){ return Math.PI / 4; }
			if(diff.X < 0 && diff.Y === 0){ return Math.PI / 2; }
			if(diff.X > 0 && diff.Y === 0){ return 3 * Math.PI / 2; }
			if(diff.X < 0 && diff.Y > 0){ return 5 * Math.PI / 4; }
			if(diff.X === 0 && diff.Y > 0){ return 0; }
			if(diff.X > 0 && diff.Y > 0){ return 7 * Math.PI / 4; }
			return 0;
		},
		setTile = function(ntx, nty) {
			tx = ntx;
			ty = nty;
			x = ntx * tileSize;
			y = nty * tileSize;
		},
		isInList = function(item, list){
	        var i;
			for( i = 0; i < list.length; i++){			
				if(item.P.is(list[i].P)){
					return i;
				}
			}
			return -1;
		},		
		removeFromList = function (item, list) {
	        var i;
			for(i = 0; i < list.length; i++){
				if(item.P.is(list[i].P)){
					list.splice(i, 1);
					return;
				 }
			}		
		},
		findPath = function(start, end) {
			var openList = [];
			var closedList = [];
			var currentNode = start
			var parent = { G: 0, H: start.distanceTo(end), F: start.distanceTo(end), P: start };
	        var n, node, path, i, lowest;
			openList.push(parent);
			while(openList.length > 0){
				currentNode = parent.P;
				var neighbors = [	{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X, currentNode.Y - 1) },
								 	{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X - 1, currentNode.Y - 1) },
								 	{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X - 1, currentNode.Y) },
									{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X, currentNode.Y + 1) },
									{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X + 1, currentNode.Y + 1) },
									{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X + 1, currentNode.Y) },
									{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X + 1, currentNode.Y - 1) },
									{ G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X - 1, currentNode.Y + 1) } ];			

				closedList.push(parent);

				removeFromList(parent, openList);				
				for(n = 0; n < neighbors.length; n++){
					node = neighbors[n];
					if(node.P.is(end)){ 
						//debug("path found");
						path = [];
						node.parent = parent;
						path.unshift(node.P);
						while(!node.P.is(start)){
							node = node.parent;
							path.unshift(node.P);
						} 
						return path;
					}
					if(!isInList(node, closedList) !== -1 /*&& this.isSafeTile(node)*/){
						node.H = node.P.distanceTo(end);
						node.F = node.G + node.H;
						var listNode = openList[isInList(node, openList)];
						if(listNode && listNode.F > node.F){
							listNode.parent = parent;
							listNode.F = node.F;
							listNode.G = node.G;
						}
						else if(!listNode){
							node.parent = parent;
							openList.push(node);
						}					
					}
				}
	            lowest = 0;
				for(i = 0; i < openList.length; i++){
					if(openList[i].F < openList[lowest].F){
						lowest = i;
					}			
				}
				parent = openList[lowest];
			}
			//debug("No path found"); 
			return [];
		};
	return {
		draw: function() {
			game.context.save();
			game.context.fillStyle = color;
			game.context.strokeStyle = "black";
			game.context.translate(x - gameView.map.offset.X * tileSize, y - gameView.map.offset.Y * tileSize);
			game.context.rotate(angle);
			game.context.fillRect(-8, -16, 16, 32);
			game.context.strokeRect(-8, -16, 16, 32);
			game.context.restore();	
			//console.log(angle);
			//console.log(targetAngle);
			if(angle != targetAngle) {
				//angle += 0.1;
			}	
			this.update();	
		},
		go: function(dest) {
			path = findPath(bt.Vector(x / tileSize | 0, y / tileSize | 0), dest);
			tileTime = (new Date()).getTime();
			console.log(path);
		},
		update: function() {
			if(path.length > 0) {
				curTime = (new Date()).getTime() - tileTime;
				if(curTime > moveDuration) {
					var to = path.shift();
					setTile(to.X, to.Y);
					tileTime = (new Date()).getTime();
				} 
				else {
					var xdest = path[0].X * tileSize,
						ydest = path[0].Y * tileSize,
						xtarg = tx * tileSize,
						ytarg = ty * tileSize,
						xdiff = xdest - xtarg,
						ydiff = ydest - ytarg,
						fract = parseFloat(curTime) / parseFloat(moveDuration);
					x = xtarg + (fract * xdiff) | 0;
					y = ytarg + (fract * ydiff) | 0;
					angle = getAngle(xdest, ydest, xtarg, ytarg);
				}
				/*
				var to = path.shift();
				setTile(to.X, to.Y);
				*/
				
			}
		}
	}
};