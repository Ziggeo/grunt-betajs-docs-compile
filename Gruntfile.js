module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile/grunt.js');

	gruntHelper.init(pkg, grunt)
	
    /* Testing */
    .lintTask(null, ['./src/**/*.js', './publish.js', './Gruntfile.js'])
	
    /* External Configurations */
    .codeclimateTask()
    
    /* Markdown Files */
	.readmeTask(null, {
		installdoc: "./docsrc/tutorials/install.md"
	})
    .licenseTask()
    
    /* Documentation */
    .docsTask(null, {
    	internal: true,
    	installdoc: "./docsrc/tutorials/install.md"
    });

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['lint', 'readme', 'license', 'codeclimate', 'docs']);

};
