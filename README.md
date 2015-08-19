# grunt-betajs-docs-compile

> Generate [BetaJS](http://betajs.com/) documentation.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-betajs-docs-compile --save-dev
```

Once the plugin has been installed, it may be enabled via the jsdoc plugin inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jsdoc');
```

## The "jsdoc" task

```js
		jsdoc : {
			dist : {
				src : sources,
				options : {
					destination : '../',
					template : 'node_modules/grunt-jsdoc/node_modules/grunt-betajs-docs-compile',
					configure : './jsdoc.conf.json',
					tutorials : './tutorials'
				}
			}
		}
```

## Contributors

- Oliver Friedmann

## License

MIT


## Credits
This software uses modified portions of
- [Ink-Docstrap](https://www.npmjs.com/package/ink-docstrap)

