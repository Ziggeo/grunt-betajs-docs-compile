
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

#### Additional configuration

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