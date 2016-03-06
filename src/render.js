module.exports = function (environment) {
	var _ = require("underscore");
	var fs = require("jsdoc/fs");

	/** Render Utilities
	 * @module Render
	 */
	return {
		
		
		/** Finds a template file by name and returns its content
		 *
		 * @param {string} templateName - file name of template without path and extension
		 * @return {string} content of template file
		 */
		readTemplate: function (templateName) {
			var ts = environment.paths.templateDirectores;
			
			for (var i = 0; i < ts.length; ++i) {
				var fname = ts[i] + "/" + templateName + ".tmpl";
				if (fs.existsSync(fname))
					return environment.globals.fileSupport.readFile(fname);
			}
			throw ("Template '" + templateName + "' not found.");
		},

		
		/** Renders a template file by name to a string
		 *
		 * @param {string} templateName - file name of template without path and extension
		 * @param {object} data - data object that is embedded in the rendering environment
		 * @return {string} content of rendered template
		 */
		renderTemplate: function (templateName, data) {
			return (_.template(this.readTemplate(templateName), null, {
		        evaluate: /<\?js([\s\S]+?)\?>/g,
		        interpolate: /<\?js=([\s\S]+?)\?>/g,
		        escape: /<\?js~([\s\S]+?)\?>/g
		    })).call(environment, _.extend({render: this}, data));
		},
		
		
		/** Renders a template file by name embedded in the layout to a string
		 *
		 * @param {string} templateName - file name of template without path and extension
		 * @param {object} data - data object that is embedded in the rendering environment
		 * @return {string} content of rendered template within the layout
		 */
		renderPage: function (templateName, data) {
			return this.renderTemplate("layout", _.extend({
				header: this.renderTemplate("header", data),
				footer: this.renderTemplate("footer", data),
				main: this.renderTemplate(templateName, data),
				template_name: templateName				
			}, data));
		},
		
		
		/** Renders a template file by name embedded in the layout to a file name
		 *
		 * @param {string} fileName - output filename relative to the output paths in the environment
		 * @param {string} templateName - file name of template without path and extension
		 * @param {object} data - data object that is embedded in the rendering environment
		 * @param {boolean} resolveLinks - resolve links in rendered page (default false)
		 * @return {string} content of rendered template within the layout
		 */
		renderPageToFile: function (fileName, templateName, data, resolveLinks) {
			data.file_name = fileName;
			var rendered = this.renderPage(templateName, data);
			if (resolveLinks)
				rendered = environment.globals.helper.resolveLinks(rendered);
			environment.globals.fileSupport.writeFile(environment.paths.output + "/" + fileName, rendered);
		}
		
	};
};
