'use strict';

var gutil     = require('gulp-util');
var through   = require('through2');
var chalk     = require('chalk');
var hookStdio = require('hook-stdio');
var extend    = require('util-extend');
var Detector  = require('buddy.js/lib/detector');
var reporters = require('buddy.js/lib/reporters');

function buddySucceeded(output, reporter) {
	switch(reporter) {
		case 'simple':
			return (output.indexOf('No magic numbers found') > -1);
		case 'detailed':
			return (output.indexOf('No magic numbers found') > -1);
		case 'json':
			return output === '[]';
		default:
			return true;
	}
}

module.exports = function(options) {
	var paths = [];

	options = extend({
		ignore: [0, 1],
		disableIgnore: false,
		detectObjects: false,
		reporter: 'simple',
		enforceConst: false,
		noColor: false
	}, options);
	options.ignore = options.disableIgnore ? [] : options.ignore;

	if (options.noColor) {
		chalk.enabled = false;
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		paths.push(file.path);
		cb(null, file);
	}, function (cb) {
		if (paths.length === 0) {
			cb();
			return;
		}

		var detector = new Detector(paths, options);
		var reporter = new reporters[options.reporter](detector);

		var output = '';
		var unhook = hookStdio.stdout(function(string) {
			output += string;
		}, true);

		detector.run().then(function() {
			unhook();

			if (!buddySucceeded(output, options.reporter)) {
				this.emit('error', new gutil.PluginError('gulp-buddy.js', 'buddy.js failed', {
					showStack: false
				}));
			}

			cb();
		}.bind(this), function(e) {
			throw new gutil.PluginError('gulp-buddy.js', e);
		});
	});

};
