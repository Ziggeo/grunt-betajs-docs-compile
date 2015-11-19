module.exports = function (environment) {
	var _ = require("underscore");
	var fs = require("jsdoc/fs");

	return {
		
		readTemplate: function (templateKey) {
			var ts = environment.paths.templateDirectores;
			
			for (var i = 0; i < ts.length; ++i) {
				var fname = ts[i] + "/" + templateKey + ".tmpl";
				if (fs.existsSync(fname))
					return environment.globals.fileSupport.readFile(fname);
			}
			throw ("Template '" + templateKey + "' not found.");
		},

		renderTemplate: function (templateName, data) {
			return (_.template(this.readTemplate(templateName), null, {
		        evaluate: /<\?js([\s\S]+?)\?>/g,
		        interpolate: /<\?js=([\s\S]+?)\?>/g,
		        escape: /<\?js~([\s\S]+?)\?>/g
		    })).call(environment, _.extend({render: this}, data));
		},
		
		renderPage: function (templateName, data) {
			return this.renderTemplate("layout", _.extend({
				header: this.renderTemplate("header"),
				footer: this.renderTemplate("footer"),
				main: this.renderTemplate(templateName, data)
			}, data));
		},
		
		renderPageToFile: function (fileName, templateName, data, resolveLinks) {
			var rendered = this.renderPage(templateName, data);
			if (resolveLinks)
				rendered = environment.globals.helper.resolveLinks(rendered);
			environment.globals.fileSupport.writeFile(environment.paths.output + "/" + fileName, rendered);
		}
		
	};
};
