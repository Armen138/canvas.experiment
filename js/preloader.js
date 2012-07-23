/* quick + dirty image preloader */
qdip = {
	total: 0,
	loaded: 0,
	images: {},
	load: function(files) {
		function loaded(file) {
			qdip.loaded++;
			qdip.trigger("progress", file);
			if(qdip.loaded === qdip.total) {
				qdip.trigger("load");
			}
		}
		for(var file in files) {
			qdip.total++;
			var img = new Image();
			(function(img, file){
				img.onload = function() {
					loaded(file);
				};
				img.onerror = function() {
					//fail silently.
					loaded(file);
				};
			}(img, file));			
			img.src = files[file];
			qdip.images[file] = img;
		}
	}
};
LucidJS.emitter(qdip);
