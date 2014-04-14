module.exports = function(grunt) {

	// Initialize config.
	grunt.initConfig({
		wd: global.cyclecwd,
		pkg: grunt.file.readJSON('./package.json'),
		buildTasks: [],
		clean: {
			temp: [ '.tmp/' ]
		}
	});

	if (!global.configutil.loadConfig(grunt))
		return;

	// Verify the config
	global.configutil.verifyConfig(grunt);

	// Hijack the logger
	global.loghook(grunt);

	// Load our utility tasks
	grunt.loadTasks('tasks/util');

	// Load per-task configs from separate files.
	grunt.loadTasks('tasks');

	// Load some npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-clean');

	// Register our build and watch tasks
	grunt.registerTask('buildTasks', grunt.config('buildTasks'));
	grunt.registerTask('build', ['clean:temp', 'buildTasks']);
	grunt.registerTask('default', ['build', 'task-watch']);

	grunt.registerTask('config', function () { 
		console.log(grunt.config.get()); 
	});

	//Restore the cwd to the calling folder
	process.chdir(grunt.config('wd'));
};