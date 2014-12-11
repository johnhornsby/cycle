module.exports = {
	name: 'task-nuget',
	dependencies: [],
	register: register,
	buildTask: false,
	catchTemplate: /(nuget*)\w+/g
};

function register(grunt) {

	var path = require('path');

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('nuget', 'Disabled.', []);
		grunt.registerTask('task-nuget', 'Disabled.', []);
		return false;
	}

	// Load the nuget tasks
	grunt.task.loadNpmTasks('grunt-nuget');

	// Configure nuget
	grunt.config('nugetpack', {
		'publish': grunt.config('config.nuget.build')
	});

	grunt.config('nugetpush', {
		'publish': grunt.config('config.nuget.push')
	});


	// Assign our tasks
	grunt.registerTask('nuget', 'Disabled.', [ 'nugetpack:publish', 'nugetpush:publish' ]);
	grunt.registerTask('task-nuget', 'Disabled.', [ 'nuget' ]);

	/*grunt.registerTask('task-sitecore-asp', 'Synchronizes assets for sitecore.', ['sync:asp']);
	grunt.registerTask('task-sitecore-css', 'Synchronizes assets for sitecore.', ['sync:sccss']);
	grunt.registerTask('task-sitecore-js', 'Synchronizes assets for sitecore.', ['sync:scjs']);
	grunt.registerTask('task-sitecore', 'Synchronizes assets for sitecore.', ['sync:asp', 'sync:scjs', 'sync:sccss']);*/

	return true;
};


function verifyConfig(grunt) {
	// Do we have a nuget configuration object assigned?
	var nugetOptions = grunt.config('config.nuget');
	if (nugetOptions === undefined)
		return false;

	var config = {
		/*'sitecore_path': [ ['type:string', 'notEmptyString'],
			"Invalid 'sitecore_path' folder given. Please specifiy a valid path, or remove the option to avoid syncing your sitecore folder." ]*/
	};

	return global.configutil.validateConfig(grunt, config);
}