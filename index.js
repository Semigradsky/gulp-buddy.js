'use strict';

var gutil     = require('gulp-util');
var through   = require('through2');
var chalk     = require('chalk');
var Detector  = require('buddy.js/lib/detector');
var reporters = require('buddy.js/lib/reporters');

function hook_stdout(callback) {
	process.stdout.write = (function(write) {
		return function(string, encoding, fd) {
			write.apply(process.stdout, arguments);
			callback(string, encoding, fd);
		};
	})(process.stdout.write);
}

function checkOutput(output, reporter) {
	switch(reporter) {
		case "simple":
			return (output.indexOf("No magic numbers found") > -1);
		case "detailed":
			return (output.indexOf("No magic numbers found") > -1);
		case "json":
			return output === "[]";
		default:
			return true;
	}
}

module.exports = function(options) {
	var paths = [];

	options = options || {};
	options.ignore = options.ignore || [0, 1];
	options.disableIgnore = options.disableIgnore || false;
	options.reporter = options.reporter || "simple";
	options.enforceConst = options.enforceConst || false;
	options.noColor = options.noColor || false;

	if (options.noColor) {
		chalk.enabled = false;
	}

	var ignore = options.disableIgnore ? [] : options.ignore;

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

		var detector = new Detector(paths, options.enforceConst, ignore);
		var reporter = new reporters[options.reporter](detector);

		var output = "";
		hook_stdout(function(string, encoding, fd) {
			output += string;
		});

		detector.run().then(function() {
			if (checkOutput(output, options.reporter)) {
				cb();
			}
			return;
		}, function(e) {
			throw new gutil.PluginError('gulp-buddy.js', e);
		});
	});

};
