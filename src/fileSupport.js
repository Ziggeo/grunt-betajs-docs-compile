var helper = require('jsdoc/util/templateHelper');
var fs = require("jsdoc/fs");

module.exports = {
	
	readFile: function (f) {
		return fs.readFileSync(f, 'utf8');
	},
	
	writeFile: function (f, data) {
		return fs.writeFileSync(f, data, 'utf8');
	},
	
	readJSON: function (f) {
		return JSON.parse(this.readFile(f));
	},
	
	readHtmlSafe: function (f) {
		return helper.htmlsafe(this.readFile(f));
	},
	
	shortenPaths: function (files, commonPrefix) {
		Object.keys(files).forEach(function(file) {
			files[file].shortened = files[file].resolved.replace(commonPrefix, '').replace(/\\/g, '/');
		});
		return files;
	},
	
	copyDirectory: function (source, dest) {
		fs.ls(source, 3).forEach(function (fileName) {
			var destination = fs.toDir(fileName.replace(source, dest));
			fs.mkPath(destination);
			fs.copyFileSync(fileName, destination);
		});	
	}
		
};