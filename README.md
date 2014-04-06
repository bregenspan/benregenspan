benregenspan
============

This is the source repository for Ben Regenspan's personal home page.

As such, you are probably Ben Regenspan, wondering what you could possibly
have been thinking at some time in the past.


Building
--------

The page is built with Grunt. The procedure in a new checkout looks like:

 * Ensure that Node is installed
 * From the project directory, install dependencies: `npm install`
 * Now, build the project: `grunt`


Developing
----------

Source is in the `src` folder; builds go to the `build` folder.

CSS is managed via SCSS; it gets compiled by running `grunt` along with
everything else.


Releasing
---------

After committing and pushing source changes, run:
`grunt deploy`

This will build and deploy to GitHub Pages, as well as create a matching
tag in the source repository and pages repository.
