# cycle

Sequence build automation.

## Features

+ **Automation**
    + *Coffeescript* - Coffeescript is compiled and concatenated into a single app.js file, and minified as necessary.
    + *Sass* - Scss files are also compiled and concatenated into individual .css files, allowing multiple 'main' stylesheets.
    + *Prototyping* - When working on the initial static build, cycle will serve up html files on a local webserver.
    + *Livereload* - All asset files, including static html, is watched for changes and will instantly update in the browser.
    + *Bower* - Any bower components installed are automatically found and merged into vendor.css and vendor.js files for easy addition. Bower is also watched so that installing any additional components will also update the browser.
    + *Extensible* - Any other automation features are easily added without intefering with existing features, or breaking backwards-compatibility with older cycle projects.

+ **Configuration**
    + *Highly configurable* - Cycle is designed to be able to adapt to any project through it's configuration. All automation features are configurable, and other options for this are easily added.
    + *Modular* - Modules that aren't being used (bower, sass, etc) aren't even loaded if they aren't necessary, speeding up load and watch times.
    + *Extensive error checking* - The configuration is parsed and checked extensively, giving a verbose error if anything is misconfigured.

+ **Setup**
    + *Easy* - Cycle is configured as a global module, and only needs to be installed once on a machine.
    + *Maintainable* - Having cycle as a global app means easy updates and no disparity between versions.
    + *Scaffold* - Cycle can generate a simple boilerplate file structure for easily starting new projects.
    + *Notifications* - If you are on a mac, or have growl installed on windows, cycle gives popup notifications informing you of errors or successful builds.

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
