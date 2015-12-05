module.banner = '/*!\n<%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\nCopyright (c) <%= pkg.contributors %>\n<%= pkg.license %> Software License.\n*/\n';

module.exports = function(grunt) {

	grunt
		.initConfig({
			pkg : grunt.file.readJSON('package.json'),
			'revision-count' : {
				options : {
					property : 'revisioncount',
					ref : 'HEAD'
				}
			},
			clean : {
				jsdoc : ['./jsdoc.conf.json']
			},
			jsdoc : {
				dist : {
					src : [ './README.md', './src/*.js' ],
					options : {
						destination : 'docs',
						template : ".",
						configure : "./jsdoc.conf.json",
						tutorials: "./docsrc/tutorials",
						recurse: true
					}
				}
			},
			wget : {
				dependencies : {
					options : {
						overwrite : true
					},
					files : {
						"./assets/scripts/jquery-hashchange.js" : "http://cdn.rawgit.com/cowboy/jquery-hashchange/master/jquery.ba-hashchange.js",
						"./assets/scripts/scoped.js" : "https://raw.githubusercontent.com/betajs/betajs-scoped/master/dist/scoped.js",
						"./assets/scripts/beta.js" : "https://raw.githubusercontent.com/betajs/betajs/master/dist/beta.js",
						//"./assets/scripts/betajs-ui.js" : "https://raw.githubusercontent.com/betajs/betajs-ui/master/dist/beta-ui.js",
						"./assets/scripts/betajs-browser.js" : "https://raw.githubusercontent.com/betajs/betajs-browser/master/dist/betajs-browser-noscoped.js",
						"./assets/scripts/betajs-dynamics-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.js",
						"./assets/scripts/jquery.js" : "https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js"
					}
				}
			},
			template : {
				"jsdoc": {
					options: {
						data: {
							data: {
								"tags": {
									"allowUnknownTags": true
								},
								"plugins": ["plugins/markdown"],
								"templates": {
									"cleverLinks": false,
									"monospaceLinks": false,
									"dateFormat": "ddd MMM Do YYYY",
									"outputSourceFiles": true,
									"outputSourcePath": true,
									"systemName": "BetaJS",
									"footer": "",
									"copyright": "BetaJS (c) - MIT License",
									"navType": "vertical",
									"theme": "cerulean",
									"linenums": true,
									"collapseSymbols": false,
									"inverseNav": true,
									"highlightTutorialCode": true,
									"protocol": "fred://",
									"singleTutorials": true,
									"emptyTutorials": true,
									"baseTemplate" : "test"
								},
								"markdown": {
									"parser": "gfm",
									"hardwrap": true
								}
							}
						}
					},
					files : {
						"jsdoc.conf.json": ["json.tpl"]
					}
				},
				"readme" : {
					options : {
						data: {
							indent: "",
							framework: grunt.file.readJSON('package.json')
						}
					},
					files : {
						"README.md" : ["readme.tpl"]
					}
				}

			}
		});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-wget');
	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('docs', ['template:jsdoc', 'jsdoc', 'clean:jsdoc']);
	grunt.registerTask('dependencies', [ 'wget:dependencies' ]);
};
