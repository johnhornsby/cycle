var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	colors = require('colors');

var tfsPath = "C:\\Program Files (x86)\\Microsoft Visual Studio 11.0\\Common7\\IDE\\TF.exe";


module.exports = function (grunt) {
	
	// Does our TFS path exist?
	if (!fs.existsSync(tfsPath)) {
		console.log("[" + "cycle".yellow + "] Unable to locate TFS executable.");
		return;
	}

	// Hook our file write function
	grunt.util.hooker.hook(grunt.file, 'write', writeFile);

	function writeFile(filepath, contents, options) {
		// Call normally and see if any errors are thrown
		var result;

		try 
		{
			var fn = grunt.util.hooker.orig(grunt.file, 'write');

			fn(filepath, contents, options);
		}
		catch (e) 
		{
			if (e.origError && e.origError.code === 'EPERM') {
				console.log("[" + "cycle".yellow + "] Unable to write to '" + filepath + "', attempting TFS checkout..");

				if (!tfsCheckout(filepath))
					throw e;
			}
			else
				throw e;				
		}

		return grunt.util.hooker.preempt(result);
	}

	function tfsCheckout(grunt, filepath) {

		var shellCmd = '"' + tfsPath + '" checkafaout ' + filepath;
		global.completeCount++;

		exec(shellCmd, function (error, stdout, stderr) {
			console.log(error);
			console.log(stdout);
			console.log(stderr);

			grunt.fail.fatal("Unable to checkout '" + filepath + "' for editing under TFS. Please check out for editing normally using Visual Studio.");
			global.completeCount--;
		});

		return true;
	}
};

