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
					template : 'node_modules/grunt-betajs-docs-compile',
					configure : './jsdoc.conf.json',
					tutorials : './tutorials'
				}
			}
		}
```

## Additional configuration

Additional configuration can be done in the jsdoc.conf.json. It might looks like this:

```js
{
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
		"systemName": "FooBar",
		"footer": "",
		"copyright": "MIT License",
		"navType": "vertical",
		"theme": "cerulean",
		"linenums": true,
		"collapseSymbols": false,
		"inverseNav": true,
		"highlightTutorialCode": true,
		"protocol": "fred://"
	},
	"markdown": {
		"parser": "gfm",
		"hardwrap": true
	}
}
```

This is mostly preserved and copied from [Ink-Docstrap](https://www.npmjs.com/package/ink-docstrap). Additionally, you can use the following optional arguments:

```js
{
	...
	
	"templates": {
		...
		
		"template": "my/local/template/directory",
        "emptyTutorials": false || true,
        "singleTutorials": false || true,
        "singleModules": false || true
	},

    ...
    
    "pages": {
    	"about": {
    		"title": "About",
    		"source": "./about.md"
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

