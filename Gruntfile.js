var GruntPageConfig = require('xsm-grunt-page-config')
var LessNpmImportPlugin = require('less-plugin-npm-import')

module.exports = function (grunt) {

	var defaultConfig = {
		less: {
			options: {
				compress: true,
				plugins: [new LessNpmImportPlugin()]
			}
		},
		browserify: {
			options: {
				browserifyOptions: {
					extensions: ['.js', '.coffee']
				},
				transform: [['coffeeify',{global:true}]]
			}
		},
	}

	grunt.initConfig(
		new GruntPageConfig({
			grunt: grunt,
			config: defaultConfig,
			directory: ''
		}).addPages(
			'displayfile',
			'uploadfile',
			'videocap',
			'apply_print'
		).getConfig()
	)
}
