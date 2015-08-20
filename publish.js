exports.publish = function (data, opts, tutorials) {
	
	var environment = require(__dirname + "/src/environment")(data, opts, tutorials);
	require(__dirname + "/src/data")(environment);
	var render = require(__dirname + "/src/render")(environment);
	var fileSupport = require(__dirname + "/src/fileSupport");
	
	fileSupport.copyDirectory(environment.paths.assets, environment.paths.output);
	
	render.renderPageToFile("index.html", "page", {
		title: environment.strings.mainpagetitle,
		content: environment.strings.readme
	});
	
	for (var key in environment.data.pages) {
		var page = environment.data.pages[key];
		render.renderPageToFile(page.url, "page", {
			title: page.title,
			content: page.content
		});
	}

	function renderTutorial(tutorial, ancestors) {
		render.renderPageToFile(tutorial.link, "tutorial", {
			title: "Guides",
			tutorial: tutorial,
			toc: render.renderTemplate("tutorial-toc", {
				tutorials: environment.data.tutorials,
				tutorial: tutorial,
				ancestors: ancestors
			})
		}, true);
	}
	
	function renderTutorials(tutorials, ancestors) {
		var anc = ancestors.slice();
		anc.push(tutorials);
		tutorials.children.forEach(function (tutorial) {
			renderTutorial(tutorial, anc)
		});
		tutorials.children.forEach(function (tutorial) {
			renderTutorials(tutorial, anc);
		});
	}
	
	renderTutorials(environment.data.tutorials, []);
	
	if (environment.config.outputSourceFiles) {
		for (var resolved in environment.data.sourceFiles) {
			var entry = environment.data.sourceFiles[resolved];
			render.renderPageToFile(entry.outfile, "source", {
				title: "Source: " + entry.shortened,
				code: fileSupport.readHtmlSafe(entry.resolved)
			}, false);
		}
	}


	/*
	var taffy = require( 'taffydb' ).taffy;
	
	var renderModule = function (module) {
		renderPageToFile("module.html", "module", {
			title: "Module: " + module.name,
			module: module
		});
	};
	
	for ( var longname in helper.longnameToUrl ) {
		helper.find(taffy(members.modules), {longname : longname}).forEach(function (entry) {
			if (entry.kind == "module")
			//	renderModule(entry);
		});
	}
	
	*/
}