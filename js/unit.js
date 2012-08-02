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
				if(item.P.is(list[i].P)){
					return i;
				}
			}
			return -1;
		},
		findPath = function(start, end) {
			var openList = [],
				closedList = [],
				currentNode = start,
				parent = { G: 0, H: start.distanceTo(end), F: start.distanceTo(end), P: start },
	        	n, node, path, i, lowest;
			openList.push(parent);
			while(openList.length > 0){
				currentNode = parent.P;
				var neighbors = [ { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X, currentNode.Y - 1) },
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X - 1, currentNode.Y - 1)},
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X - 1, currentNode.Y)},
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X, currentNode.Y + 1)},
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X + 1, currentNode.Y + 1)},
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X + 1, currentNode.Y)},
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X + 1, currentNode.Y - 1)},
								  { G: parent.G + 1, H: 0, F: 0, P: bt.Vector(currentNode.X - 1, currentNode.Y + 1)} ];

				closedList.push(parent);
				openList.splice(isInList(parent, openList), 1);
				for(n = 0; n < neighbors.length; n++){
					node = neighbors[n];
					if(node.P.is(end)){
						path = [];
						node.parent = parent;
						path.unshift(node.P);
						while(!node.P.is(start)){
							node = node.parent;
							path.unshift(node.P);
						}
						return path;
					}
					if(isInList(node, closedList) === -1 /*&& this.isSafeTile(node)*/){
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
			//No path found
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
			var dest = gameView.map.at(dtx, dty);
				path = findPath(bt.Vector(x / tileSize | 0, y / tileSize | 0), dest);
			console.log(path);
		}
	}
};