var helper = require('jsdoc/util/templateHelper');
var fs = require("jsdoc/fs");

/** File Support
 * @module FileSupport
 */
module.exports = {
	

	/** Read a file to a string synchronously 
	 *
	 * @param {string} f - file name of file to be read
	 * @return {string} content of file
	 */
	readFile: function (f) {
		return fs.readFileSync(f, 'utf8');
	},
	
	
	/** Write a string to a file synchronously 
	 *
	 * @param {string} f - file name of file to be written
	 * @param {string} data - content of be written
	 */
	writeFile: function (f, data) {
		return fs.writeFileSync(f, data, 'utf8');
	},
	
	
	/** Read a file to JSON synchronously 
	 *
	 * @param {string} f - file name of file to be read
	 * @return {object} parsed JSON
	 */
	readJSON: function (f) {
		return JSON.parse(this.readFile(f));
	},
	
	
	/** Read a file to an html-safe string synchronously 
	 *
	 * @param {string} f - file name of file to be read
	 * @return {object} html-safe content of file
	 */
	readHtmlSafe: function (f) {
		return helper.htmlsafe(this.readFile(f));
	},
	
	
	/** Generates shortened paths names for files by removing a common prefix 
	 *
	 * @param {object} files - files object
	 * @param {string} commonPrefix - common prefix that is to be removed 
	 * @return {object} updated files object
	 */
	shortenPaths: function (files, commonPrefix) {
		Object.keys(files).forEach(function(file) {
			files[file].shortened = files[file].resolved.replace(commonPrefix, '').replace(/\\/g, '/');
		});
		return files;
	},
	
	
	/** Copy a file to a directory, creating the directory if it doesn't exist. 
	 *
	 * @param {string} fileName - file to be copied
	 * @param {string} dest - target directory 
	 */
	copyFileToDirectory: function (fileName, dest) {
		fs.mkPath(dest);
		fs.copyFileSync(fileName, dest);
	},
	

	/** Copy a whole directory with files to a directory, creating the target directory if it doesn't exist. 
	 *
	 * @param {string} source - source directory
	 * @param {string} dest - target directory 
	 */
	copyDirectory: function (source, dest) {
		fs.ls(source, 3).forEach(function (fileName) {
			var destination = fs.toDir(fileName.replace(source, dest));
			fs.mkPath(destination);
			fs.copyFileSync(fileName, destination);
		});	
	}
		
};