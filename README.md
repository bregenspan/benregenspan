benregenspan
============

This is the source repository for Ben Regenspan's personal home page.

As such, you are probably Ben Regenspan, wondering what you could possibly
have been thinking at some time in the past.


Building
--------

This page is built by Webpack.

 * Ensure that Node is installed
 * From the project directory, install dependencies: `npm install`
 * Now, build the project: `npm run build`. (This also launches [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer)


Developing
----------

### Useful commands:
 * `npm run lint` - lint JS
 * `npm run serve` - run local development server

### Folders:
 * `src` - source code
 * `static` - static files that should be deployed verbatim to the root folder of the site
 * `dist` - built files


Releasing
---------

Ensure an ~/.aws/credentials is correctly configured.

After committing and pushing source changes, run:

`npm run build && npm run deploy`

This will trigger a production build and deploy to S3.
