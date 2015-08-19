module.exports = function (environment) {
	var _ = require("underscore");

	return {
		
		renderTemplate: function (templateName, data) {
			return (_.template(environment.globals.fileSupport.readFile(environment.paths.templates + "/" + templateName + ".tmpl"), null, {
		        evaluate: /<\?js([\s\S]+?)\?>/g,
		        interpolate: /<\?js=([\s\S]+?)\?>/g,
		        escape: /<\?js~([\s\S]+?)\?>/g
		    })).call(environment, data || {});
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
