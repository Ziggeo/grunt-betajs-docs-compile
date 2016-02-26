
module.exports = function (environment) {
	
	environment.assets = [];
	
	environment.assets.push({
		from: environment.paths.assets + "/img",
		to: environment.paths.output + "/img"
	});

	environment.assets.push({
		from: [
		    environment.paths.assets + "/styles/sunlight." + environment.styling.syntaxTheme + ".css",
		    environment.paths.assets + "/styles/site." + environment.styling.theme + ".css",
		    environment.paths.assets + "/styles/snippets.css"
        ],
		to: environment.paths.output + "/styles"
	});
	
	environment.assets.push({
		from: [
		    environment.paths.assets + "/scripts/bootstrap.js",
		    environment.paths.assets + "/scripts/docstrap.lib.js",
		    environment.paths.assets + "/scripts/sunlight.js",
		    environment.paths.assets + "/scripts/jquery.js",
		    environment.paths.assets + "/scripts/toc.js",
		    environment.paths.assets + "/scripts/snippets.js"
	    ],
		to: environment.paths.output + "/scripts"
	});
	
};