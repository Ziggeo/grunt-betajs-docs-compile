/*
 * 
 * Linking
 * 
 * 
 */

function hashToLink(helper, doclet, hash) {
	return /^(#.+)/.test(hash) ? ('<a href="' + helper.createLink(doclet).replace(/(#.+|$)/, hash) + '">' + hash + '</a>') : hash;
}





/*
 * 
 * Generates a tutorial
 * 
 * 
 */

function generateTutorial(parent, name, title, content) {
	return {
		title: title || "",
		content: content || "",
		type: 2,
		parent: parent,
		name: (parent ? parent.name + "-" : "") + name,
		link: 'tutorial-' + (parent ? parent.name + "-" : "") + name + '.html',
		children: [],
		parse: function () {
			return content || "";
		}
	};
}

/*
 * 
 * Sorts tutorials with respect to their original order (which is not preserved by JSDOC)
 * 
 * 
 */

function processTutorials(environment, hierarchy, tutorials, emptyTutorials) {
	var helper = environment.globals.helper;
	if (!hierarchy || !tutorials.children)
		return tutorials;
	var children = {};
	tutorials.children.forEach(function(child) {
		children[child.name] = child;
		child.link = helper.tutorialToUrl(child.name);
	});
	tutorials.children = [];
	for (var key in hierarchy) {
		var processed = null;
		if (key in children)
			processed = processTutorials(environment, hierarchy[key].children, children[key]);
		else if (emptyTutorials)
			processed = processTutorials(environment, hierarchy[key].children, generateTutorial(tutorials, key, hierarchy[key].title), emptyTutorials);
		if (processed) {
			for (var inner in hierarchy[key])
				if (inner != "title" && inner != "children")
					processed[inner] = hierarchy[key][inner];
			tutorials.children.push(processed);
		}
	}
	return tutorials;
}


/*
 * 
 * Processes pages
 * 
 * 
 */

function processPage(environment, page, key) {
	page.content = environment.globals.markdown.getParser()(environment.globals.fileSupport.readFile(page.source))
	page.url = environment.globals.helper.getUniqueFilename(key);
	return page;
}





/*
 * 
 * Processes examples in code by auto-detecting programming language and extracting the potential title
 * 
 * 
 */

function processExample(environment, example) {
	var caption = "";
	var code = "";
	var matcher = example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i);
	if (matcher) {
		caption = matcher[1];
		code = matcher[3];
	}
	var lang = /{@lang (.*?)}/.exec(example);
	if (lang && lang[1]) {
		example = example.replace(lang[0], "");
		lang = lang[1];
	} else
		lang = null;
	return {
		caption: caption,
		code: code || example,
		lang: lang && config.styling.highlightTutorialCode ? lang : "javascript"
	};
};


/*
 * 
 * Processes see links
 * 
 * 
 */

function processSee(environment, doclet, seeItem) {
	return hashToLink(environment, doclet, seeItem);
}



/*
 * 
 * Get data path prefix
 * 
 * 
 */

function getDataPrefix(data) {
	var sourceFilePaths = [];
	data().each(function (doclet) {
		if (doclet.meta)
			sourceFilePaths.push(doclet.meta.resolved);
	});
	return require('jsdoc/path').commonPrefix(sourceFilePaths);
}



/*
 * 
 * Generate file names of all source files
 * 
 * 
 */

function generateSourceFiles(data, helper) {
	var sourceFiles = {};
	data().each(function (doclet) {
		if (doclet.meta) { 
			var entry = {
				resolved: doclet.meta.resolved,
				shortpath: doclet.meta.shortpath,
				outfile: helper.getUniqueFilename(doclet.meta.shortpath)
			};
			sourceFiles[doclet.meta.resolved] = entry;
			helper.registerLink(entry.shortpath, entry.outfile);
		}
	});
	return sourceFiles;
}


/*
 * 
 * Process doclet signature
 * 
 * 
 */

function processSignatures(helper, doclet) {
	var needsSignature = false;
	if (doclet.kind === 'function' || doclet.kind === 'class')
		needsSignature = true;
	else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names && doclet.type.names.length)
		for (var i = 0; i < doclet.type.names.length; ++i)
			if (doclet.type.names[i].toLowerCase() === 'function')
				needsSignature = true;
	if (needsSignature) {
		doclet.signature = {
			params: helper.getSignatureParams(doclet, 'optionalå'),
			returns: helper.getSignatureReturns(doclet),
			attribs: helper.getAttribs(doclet)
		};
	} else if (doclet.kind === 'member' || doclet.kind === 'constant') {
		doclet.signature = {
			types: helper.getSignatureTypes(doclet),
			attribs: helper.getAttribs(doclet)
		};
		doclet.kind = 'member';
	}
}



/*
 * 
 * Attach module symbols (not sure what this good for exactly)
 * 
 * 
 */

function attachModuleSymbols( doclets, modules ) {
	var doop = require('jsdoc/util/doop');
	
	var symbols = {};

	// build a lookup table
    doclets.forEach(function(symbol) {
        symbols[symbol.memberof] = symbols[symbol.memberof] || [];
        symbols[symbol.memberof].push(symbol);
    });

    return modules.map(function(module) {
        if (symbols[module.longname]) {
            module.modules = symbols[module.longname]
                // Only show symbols that have a description. Make an exception for classes, because
                // we want to show the constructor-signature heading no matter what.
                .filter(function(symbol) {
                    return symbol.description || symbol.kind === 'class';
                })
                .map(function(symbol) {
                    symbol = doop(symbol);

                    if (symbol.kind === 'class' || symbol.kind === 'function') {
                        symbol.name = symbol.name.replace('module:', '(require("') + '"))';
                    }

                    return symbol;
                });
        }
    });
}





/*
 * 
 * Main
 *  
 * 
 */

module.exports = function(environment) {

	var helper = environment.globals.helper;
	
	helper.setTutorials(environment.raw.tutorials);
	environment.data.tutorials = processTutorials(environment,
			environment.raw.tutorialsHierarchy, environment.raw.tutorials, environment.config.emptyTutorials);
	helper.setTutorials(environment.data.tutorials);
	
	for (var page in environment.data.pages)
		environment.data.pages[page] = processPage(environment, environment.data.pages[page], page);
	
	var processed = helper.prune(environment.raw.parsed);
	environment.data.processed = processed;
	processed.sort('longname, version, since');
	
	processed().each(function (doclet) {
		if (doclet.examples) {
			doclet.examples = doclet.examples.map(function (example) {
				return processExample(environment, example);
			});
		}
		if (doclet.see) {
			doclet.see.forEach(function (seeItem, i) {
				doclet.see[i] = processSee(environment, doclet, seeItem);
			});
		}
	});	
	
	// First pass: resolve full file names
	processed().each(function (doclet) {
		if (doclet.meta)
			doclet.meta.resolved = doclet.meta.path + '/' + doclet.meta.filename;
	});	
	
	environment.paths.pathPrefix = environment.paths.sourceRootPath || getDataPrefix(processed);
	
	// Second pass: generate short paths
	processed().each(function (doclet) {
		if (doclet.meta) 
			doclet.meta.shortpath = doclet.meta.resolved.replace(environment.paths.pathPrefix, '').replace(/\\/g, '/');
	});
	
	// Third pass: generate source file names
	environment.data.sourceFiles = generateSourceFiles(processed, helper);
	
	// Fourth pass: generate links
	processed().each(function (doclet) {
		var url = helper.createLink(doclet);
		helper.registerLink(doclet.longname, url);
		url = helper.longnameToUrl[doclet.longname];
		doclet.id = url.indexOf('#') > -1 ? url.split(/#/).pop() : doclet.name;
	});
	
	// Fifth pass: generate ancestors
	processed().each(function (doclet) {
		doclet.ancestors = helper.getAncestorLinks(processed, doclet);
	});
	
	// Sixth pass: signatures
	processed().each(function (doclet) {
		processSignatures(helper, doclet);
	});
	
	var members = helper.getMembers(processed);
	environment.data.members = members;
	
	attachModuleSymbols(helper.find(processed,  { kind : ['class', 'function'] } ), members.modules );
	
};
