benregenspan
============

This is the source repository for Ben Regenspan's personal home page.

As such, you are probably Ben Regenspan, wondering what you could possibly
have been thinking at some time in the past.


Building
--------

This page is built by Webpack. A tiny amount of Grunt use remains; it is used
only to provide a deployment task.

 * Ensure that Node is installed
 * From the project directory, install dependencies: `npm install`
 * Now, build the project: `npm run build`


Developing
----------

### Useful commands:
 * `npm run lint` - lint JS
 * `npm run analyze` - analyze Webpack bundles with bundle analyzer
 * `npm run serve` - run local development server

### Folders:
 * `src` - source code
 * `static` - static files that should be deployed verbatim to the root folder of the site
 * `dist` - built files


Releasing
---------

After committing and pushing source changes, run:
`npm run deploy`

This will build and deploy to GitHub Pages, as well as create a matching
tag in the source repository and pages repository.
