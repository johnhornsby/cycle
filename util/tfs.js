var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	colors = require('colors');

var tfsPath = process.env.VS110COMNTOOLS;


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

				tfsCheckout(filepath, contents, options, e.origError);
			}
			else
				throw e;				
		}

		return grunt.util.hooker.preempt(result);
	}

	function tfsCheckout(filepath, contents, options, origError) {

		var shellCmd = '"' + tfsPath + '" checkout ' + filepath;
		global.completeCount++;

		exec(shellCmd, function (error, stdout, stderr) {
			if (error) {
				console.log("[" + "cycle".yellow + "] Unable to checkout '" + filepath + "' for editing under TFS. Please check out for editing normally using Visual Studio.");
				throw grunt.fail.fatal(origError);
			} else {
				// Write the file contents
				console.log("[" + "cycle".green + "] Checked out file '" + filepath + "'..");

				grunt.file.write(filepath, contents, options);
			}

			global.completeCount--;
		});
	}
};

