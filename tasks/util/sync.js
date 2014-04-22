module.exports = {
	name: 'task-sync',
	dependencies: [],
	register: register,
	buildTask: false
};

function register(grunt) {

	grunt.config('sync', {
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-sync');
	
	grunt.registerTask('task-sync', 'Synchronizes files between folders.', ['sync']);

	return true;
};