benregenspan
============

This is Ben Regenspan's personal home page. As such, you are probably Ben Regenspan, wondering 
what you could possibly have been thinking at some time in the past.


Building
--------

The page is built with Grunt. As such, the procedure in a new checkout looks like:

 * Ensure Node is installed
 * From the project directory, install dependencies: `npm install`
 * Now, build the project: `grunt`


Developing
----------

Source is in the `src` folder, as appropriate.  Builds go to the `build` folder.

CSS is managed via SCSS; it gets compiled by running `grunt` along with everything else.

Behavior of `grunt watch` is a little flakey, sometimes it misses file updates and doesn't 
automatically retrigger build commands.
