# asset-tracker
Log stuff and keep track of it. Simple Node.js asset tracker built using node.js, bootstrap and sqlite3...
# Setup
Before you can run the node you will need to install the following dependancies
```
npm sqlite3
npm bootstrap
npm jquery
npm jsdoc
```
# Generate documentation
The code is documented with jsdoc. Help files can be generated using the following jsdoc command:
``` 
node .\node_modules\jsdoc\jsdoc.js .\logging.js .\app.js .\page.js .\README.md
```
HTML output will be located in the ./out directory.
