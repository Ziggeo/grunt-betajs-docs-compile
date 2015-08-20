var helper = require("jsdoc/util/templateHelper");
var fileSupport = require(__dirname + "/fileSupport");
var markdown = require("jsdoc/util/markdown"); 

var envcfg = env.conf.templates || {};

module.exports = function(data, opts, tutorials) {
	return {
		globals : {
			helper : helper,
			fileSupport: fileSupport,
			markdown: markdown
		},
		paths : {
			templates : envcfg.templates || opts.template + "/templates",
			tutorials : opts.tutorials,
			output : env.opts.destination,
			assets : opts.template + "/assets",
			sourceRootPath : envcfg.sourceRootPath
		},
		raw : {
			readme : opts.readme,
			parsed : data,
			tutorials : tutorials,
			tutorialsHierarchy : fileSupport.readJSON(opts.tutorials
					+ "/tutorials.json")
		},
		strings : {
			copyright : envcfg.copyright,
			footer : envcfg.footer,
			systemName : envcfg.systemName || "Documentation",
			readme : opts.readme,
			mainpagetitle : opts.mainpagetitle || 'Main Page'
		},
		styling : {
			inverseNav : envcfg.inverseNav,
			theme : envcfg.theme || "simplex",
			syntaxTheme : envcfg.syntaxTheme || "default",
			highlightTutorialCode : envcfg.highlightTutorialCode,
			linenums : envcfg.linenums,
		},
		urls : {
			index : helper.getUniqueFilename('index')
		},
		config : {
			outputSourceFiles : envcfg.outputSourceFiles === true
		},
		meta : {
			jsdoc_version : env.version.number
		},
		data : {
			pages: env.conf.pages || {}
		} 
	};
};
