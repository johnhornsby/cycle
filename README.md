# cycle

Sequence build automation.

## Features

+ **Automation**
	+ *Coffeescript* - [Coffeescript](http://coffeescript.org/) is compiled and concatenated into a single app.js file, and minified as necessary.
	+ *Sass* - [Sass](http://sass-lang.com/) files are also compiled and concatenated into individual .css files, allowing multiple 'main' stylesheets.
	+ *Prototyping* - When working on the initial static build, cycle will serve up html files on a local webserver.
	+ *Templating* - While prototyping, [multiple template engines](https://github.com/visionmedia/consolidate.js/#supported-template-engines) can be selected which will be automatically processed, served to the browser and also watched for changes.
	+ *Livereload* - All asset files, including static html, are watched for changes and will instantly update in the browser.
	+ *Bower* - Any [Bower](http://bower.io/) components installed are automatically found and merged into vendor.css and vendor.js files for easy addition. [Bower](http://bower.io/) is also watched so that installing any additional components will also update the browser.
	+ *Extensible* - Any other automation features are easily added without interfering with existing features, or breaking backwards-compatibility with older cycle projects.
	+ *Sitecore* - If aspx and ascx files are modified, the changes are synced with the live site and the browser is refreshed immediately. All js and css assets are also constantly synced with the sitecore folder.
	+ *Autoprefixer* - Optionally use Autoprefixer to vendor-prefix your CSS properties using the Can I Use database. 
	+ *TFS* - Any files modified that are protected under TFS control will be automatically checked out for editing.


+ **Configuration**
	+ *Highly configurable* - Cycle is designed to be able to adapt to any project through it's configuration. All automation features are configurable, and other options for this are easily added.
	+ *Modular* - Modules that aren't being used ([Bower](http://bower.io/), [Sass](http://sass-lang.com/), etc) aren't even loaded if they aren't necessary, speeding up load and watch times.
	+ *Extensive error checking* - The configuration is parsed and checked extensively, giving a verbose error if anything is misconfigured.

+ **Setup**
	+ *Easy* - Cycle is configured as a global module and only needs to be installed once on a machine.
	+ *Maintainable* - Having cycle as a global app means easy updates and no disparity between versions.
	+ *Scaffold* - Cycle can generate a simple boilerplate file structure for easily starting new projects.
	+ *Notifications* - If you are on a mac, or have [Growl](http://www.growlforwindows.com/gfw/) installed on windows, cycle gives popup notifications informing you of errors or successful builds.

+ **Tasks**
	+ *Export Static* - Generate a static site `cycle task-export`. Surfaces a `exporting` variable to the Jade templates that allow for different options in the exported static files. For example:
		```
		if exporting
			script(data-main='main', src='assets/js/app.min.js')
		else
			script(data-main='main', src='assets/js/app.js')
		```

	+ *Upload* - Upload a generated static site `cycle task-upload`
	+ *Image Optimisation* - Optimise any images in the project `cycle task-imagemin`

+ **More features to come!**

## Usage

Install cycle globally `npm install git://github.com/aaerox/cycle.git -g`

Create a new folder to setup a project
`mkdir project`
`cd project`

Create a scaffold project `cycle setup`

Initialize bower modules `bower install`

Build your project `cycle`

Modify your **cycleconfig.js** file in the **assets** folder to configure cycle.

