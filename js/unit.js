Unit = function(tx, ty) {
	var x = tx * tileSize, 
		y = ty * tileSize,
		path = [],
		color = "rgba(0, 200, 100, 1.0)",
		setTile = function(ntx, nty) {
			x = ntx * tileSize;
			y = nty * tileSize;
		},
		isInList = function(item, list){
	        var i;
			for( i = 0; i < list.length; i++){			
				if(item.position.is(list[i].position)){
					return list[i];
				}
			}
			return false;
		},		
		removeFromList = function (item, list) {
	        var i;
			for(i = 0; i < list.length; i++){
				if(item.position.is(list[i].position)){
					list.splice(i, 1);
					return;
				 }
			}		
		},
		PathNode = function(g, h, f, pos){
			this.position = pos || bt.Vector(0, 0);
			this.G = g || 0;
			this.H = h || 0;
			this.F = f || 0;
			this.parent = null;
		},		
		findPath = function(start, end) {
			var openList = [];
			var closedList = [];
			var currentNode = start
			var parent = new PathNode(0, start.distanceTo(end), start.distanceTo(end), start);
	        var n, node, path, i, lowest;
			openList.push(parent);
			while(openList.length > 0){
				currentNode = parent.position;
				var neighbors = [	new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X, currentNode.Y - 1)), 
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X - 1, currentNode.Y - 1)),
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X - 1, currentNode.Y)),
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X, currentNode.Y + 1)),
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X + 1, currentNode.Y + 1)),
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X + 1, currentNode.Y)),
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X + 1, currentNode.Y - 1)),
								new PathNode(parent.G + 1, 0, 0, bt.Vector(currentNode.X - 1, currentNode.Y + 1)) ];			

				closedList.push(parent);

				removeFromList(parent, openList);				
				for(n = 0; n < neighbors.length; n++){
					node = neighbors[n];
					if(node.position.is(end)){ 
						//debug("path found");
						path = [];
						node.parent = parent;
						path.unshift(node.position);
						while(!node.position.is(start)){
							node = node.parent;
							path.unshift(node.position);
						} 
						return path;
					}
					if(!isInList(node, closedList) /*&& this.isSafeTile(node)*/){
						node.H = node.position.distanceTo(end);
						node.F = node.G + node.H;
						var listNode = isInList(node, openList);
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
	setInterval(function() {
		if(path.length > 0) {
			var to = path.shift();
			setTile(to.X, to.Y);
		}
	}, 200);
	return {
		draw: function() {
			game.context.fillStyle = color;
			game.context.strokeStyle = "black";
			game.context.fillRect(x - gameView.map.offset.X * tileSize, y - gameView.map.offset.Y * tileSize, 16, 32);
			game.context.strokeRect(x - gameView.map.offset.X * tileSize, y - gameView.map.offset.Y * tileSize, 16, 32);
		},
		go: function(dtx, dty) {
			var dx = dtx / tileSize | 0 + gameView.map.offset.X,
				dy = dty / tileSize | 0 + gameView.map.offset.Y;
				path = findPath(bt.Vector(x / tileSize | 0, y / tileSize | 0), bt.Vector(dx, dy));
			console.log(path);
		}
	}
};