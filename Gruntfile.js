module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile/grunt.js');

	gruntHelper.init(pkg, grunt)
	
    /* Testing */
    .lintTask(null, ['./src/**/*.js', './publish.js', './Gruntfile.js'])
	
    /* External Configurations */
    .codeclimateTask()
    
    /* Package */
    .packageTask()
    
    /* Markdown Files */
	.readmeTask(null, {
		installdoc: "./docsrc/tutorials/install-docs-compile.md"
	})
    .licenseTask()
    
    /* Documentation */
    .docsTask(null, {
    	internal: true,
    	installdoc: "./docsrc/tutorials/install-docs-compile.md"
    });

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['package', 'lint', 'readme', 'license', 'codeclimate', 'docs']);

};
