/**
 * 
 * @file app.js
 * @namespace AssetDB
 * Module for loading and storing data
 */
var sqlite3 = require('sqlite3').verbose();
const http = require('http');
var url = require('url');
var fs = require('fs');
var Sync = require('sync');

var DEBUG = 1;

/**
 * \var hostname 
 * \brief The default hostname of the server 
 **/
const hostname = '127.0.0.1'; 
/** 
 * \var port 
 * \brief The default port number of the server 
 **/
const port = 3000; 
/** 
 * \var email address 
 * \brief The contact email address of the site author/s 
 **/
const email = "ross@rossnewman.com"
/** 
 * \var sitename 
 * \brief The name of this web application 
 **/
const sitename = "Asset Tracker"

const database = "database.db"

/** 
 * \var bootstrap_min 
 * \brief Boot strap code and stylesheet 
 **/
let bootstrap_min = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> \n \
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script> \n \
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script> \n'

class pageElements {
  constructor(res) {
    this.res = res;
    this.res.writeHead(200, {'Content-Type': 'text/html'});
  }

  write(string) {
    this.res.write(string);
  }
 
  end() {
    this.res.end();
  }

  /**
   *  \brief Ganerate the code for the navigation bar at the top of the screen.
   *
   * @param {Object} res - HTTP server response object
   */
  navbar() {
    this.res.write(`\
  <nav class="navbar navbar-expand-lg navbar-light bg-light">\n\
    <a class="navbar-brand" href="#">${sitename}</a>\n\
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n\
      <span class="navbar-toggler-icon"></span>\n\
    </button>\n\
    <div class="collapse navbar-collapse" id="navbarNav">\n\
      <ul class="navbar-nav">\n\
        <li class="nav-item active">\n\
          <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>\n\
        </li>\n\
        <li class="nav-item">\n\
          <a class="nav-link" href="/assets">Assets</a>\n\
        </li>\n\
        <li class="nav-item">\n\
          <a class="nav-link" href="/models">Models</a>\n\
        </li>\n\
        <li class="nav-item">\n\
          <a class="nav-link disabled" href="/users">Users</a>\n\
        </li>\n\
      </ul>\n\
    </div>\n\
    <form class="form-inline">\n\
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">\n\
    <button class="btn btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>\n\
  </form>\n\
</nav>\n`);
  }

  /**
   *  \brief Ganerate the code for custome style.
   *
   * @param {Object} res - HTTP server response object
   */
  styles() {
    this.res.write('\
  <style>\n\
    .btn-primary {\n\
      background: #212529;\n\
      color: #ffffff;\n\
      border: 0 none;\n\
    }\n\
    .asset_table { padding: 5px 20px 25px;}\n\
    .alignleft { float: left; }\n\
    .alignright { float: right; }\n\
    .button_create { padding: 10px 20px 0px;}\n\
    .page-footer {\n\
      position: absolute;\n\
      bottom: 0;\n\
      width: 100%;\n\
      height: 45px;\n\
      background-color: #111;\n\
      color: #ffffff;\n\
      text-align: center;\n\
    }\n\
  </style>\n');
  }
  
  header(pagename, button, uri) {
    page.write(`\
<div class="button_create" align="right" >\n\
  <p class="alignleft" style="text-align:left; font-size:24px ;">${pagename}</p>\n\
  <a href="${uri}" class="btn btn-primary" class="alignright" style="text-align:right;"> <i class="icon-home icon-white"></i>${button}</a>\n\
</div>\n`);    
  }
  /**
   *  \brief Ganerate the code for bottom of the page, footer.
   *
   * @param {Object} res - HTTP server response object
   */
  footer() {
    this.res.write(`\
<footer class="page-footer">\n\
  <div class="footer-copyright py-3 text-center">Author: ${email} \n\
    <a href="https://github.com/ross-newman/asset-tracker">\n\
        <strong>${sitename}</strong>\n\
    </a> v0.1.0\n\
  </div>\n\
</footer>\n`);
  }
}

/**
 *  \brief Home page and welcome screen.
 *
 * @param {Object} page - HTTP server response object
 */
function home(page) {
  console.log('Home Page');
  page.write(bootstrap_min);
  page.styles();
  page.write('<head>\n</head>\n<html>\n');
  page.navbar();
  page.write('<div class="jumbotron text-center">\n\
  <h1>My First Bootstrap Page</h1>\n\
  <p>Resize this responsive page to see the effect!</p> \n\
</div>\n\
\n\
<div class="container">\n\
  <div class="row">\n\
    <div class="col-sm-4">\n\
      <h3>Column 1</h3>\n\
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>\n\
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>\n\
    </div>\n\
    <div class="col-sm-4">\n\
      <h3>Column 2</h3>\n\
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>\n\
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>\n\
    </div>\n\
    <div class="col-sm-4">\n\
      <h3>Column 3</h3>\n\
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>\n\
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>\n\
    </div>\n\
  </div>\n\
</div>\n\
</html>'); 
  page.footer();
  page.end(); 
  return;
}

/**
 *  \brief List the assets.
 *
 * @param {Object} page - HTTP server response object
 */
function assets(page) {
    console.log('Assets selected');
    page.write(bootstrap_min);
    page.styles();
    page.write('<head>\n</head>\n<html>\n');
    page.navbar();
    page.header("Assets", "Create New", "/add");
    
    var db = new sqlite3.Database(`./${database}`, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      page.write('<div class="asset_table">\n'); 
      var table = '  <table class="table"> \n\
      <thead class="thead-dark"> \n\
        <tr> \n\
          <th scope="col">#</th> \n\
          <th scope="col">Name</th> \n\
          <th scope="col">Serial</th> \n\
          <th scope="col">Model</th> \n\
          <th scope="col">Status</th> \n\
        </tr> \n\
      </thead> \n\
      <tbody> \n';
      var table2 = '\
      </tbody> \n\
    </table>\n';
      page.write(table); 
      db.serialize(function() {
        db.each("SELECT assetid, name, serial, model, status FROM asset_info", function(err, row) {
          console.log(row.assetid + ": " + row.name);
          page.write('<tr> \n\
          <th scope="row">' + row.assetid + '</th> \n\
          <td>' + row.name + '</td> \n\
          <td>' + row.serial + '</td> \n\
          <td>' + row.model + '</td> \n\
          <td>' + row.status + '</td> \n\
        </tr> \n');
      }, 
      function(err, num){
        page.write(table2); 
  
        page.write('  </div>\n');
        page.footer();
        page.write('</html>\n'); 
        page.end(); 
      });
    }); /* End serialize */

  });
  return;
}
 
/**
 *  \brief Add a new asset to the database.
 * 
 * @param {Object} page - HTTP server response object
 */
function models(page) {
  console.log('Models selected');
  page.write(bootstrap_min);
  page.styles();
  page.write('<head>\n</head>\n<html>\n');
  page.navbar();
  page.header("Models", "Create New", "/");
  page.footer();
  page.write('</html>\n'); 
  page.end(); 
  return;
}

/**
 *  \brief Add a new asset to the database.
 * 
 * @param {Object} page - HTTP server response object
 */
function users(page) {
  console.log('Users selected');
  page.write(bootstrap_min);
  page.styles();
  page.write('<head>\n</head>\n<html>\n');
  page.navbar();
  page.header("Users", "Create New", "/");
  page.footer();
  page.write('</html>\n'); 
  page.end(); 
  return;
}
 
/**
 *  \brief Add a new asset to the database.
 * 
 * @param {Object} page - HTTP server response object
 */
function add(page) {
  console.log('Add selected');
  page.write(bootstrap_min);
  page.styles();
  page.write('<head>\n</head>\n<html>\n');
  page.navbar();
  page.header("Add", "Create", "/");
  page.footer();
  page.write('</html>\n'); 
  page.end(); 
  return;
}

/**
 *  \brief Add a new asset to the database.
 * 
 * @param {Object} page - HTTP server response object
 */
function setup(page) {
  console.log('Add selected');
  page.write(bootstrap_min);
  page.styles();
  page.write('<head>\n</head>\n<html>\n');
  page.navbar();
  page.header("Setup", "Complete", "/");
  page.write(`<div class="asset_table"><br>No DB found so setting up ${database}...<br><br>\n`);

  var db = new sqlite3.Database(`./${database}`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`Created ${database} database.`);
  
    db.serialize(function() {
      /*Create the tables needed to start executing the application */
      db.run("CREATE TABLE if not exists asset_info (assetid INTEGER PRIMARY KEY, name TEXT, serial TEXT, model INTEGER, status INTEGER, Location INTEGER, notes TEXT, available BOOLEAN )", function(res) {
        if (DEBUG)
        {
          /* Setup some dummy assets */
          var stmt = db.prepare("INSERT INTO asset_info VALUES (?,?,?,?,?,?,?,?)");
          stmt.run(1, "SBC324", "Prototype", 2, 1, 1, "This has no front panel", false);
          stmt.run(2, "SBC627", "12169547", 2, 1, 1, "Production Board", false);
          stmt.run(3, "RES3000", "12156432", 2, 1, 1, "OpenWare management version 4.10", false);
          stmt.run(4, "SBC329", "12154689", 2, 1, 1, "", false);
          stmt.run(5, "DSP280", "12185642", 2, 1, 1, "CentOS 7.2 installed in flash", false);
          stmt.finalize(function(err){
            db.each("SELECT assetid, name FROM asset_info", function(err, row) {
              console.log(row.assetid + ":" + row.name);
            });
          });
        }
      });
      db.run("CREATE TABLE if not exists users_info (id INTEGER PRIMARY KEY, name TEXT, email TEXT, country INTEGER)");
      db.run("CREATE TABLE if not exists status_info (id INTEGER PRIMARY KEY, status TEXT, color int)", function(res) {
        /* Setup status/s */
        var stmt = db.prepare("INSERT INTO status_info VALUES (?,?,?)");
        stmt.run(1, "Pending", "");
        stmt.run(2, "Ready to deploy", "");
        stmt.run(3, "EOL", "");
        stmt.run(4, "Item Lost", "");
        stmt.finalize();
      });
      db.run("CREATE TABLE if not exists model_info (id INTEGER PRIMARY KEY, model TEXT)");
      /* There are a lot of countries so take them from https://github.com/stefangabos/world_countries */
      fs.readFile('countries.sql', 'utf8', function(err, contents) {
        var statements = contents.split(";");
        db.run(statements[0], function(res) { /* Create the countries table */
          db.run(statements[1]); /* When created add the entries */
        });
      });

      page.write('<p style="margin-left: 40px">');
      page.write('CREATED TABLE asset_info...<br>\n');
      page.write('CREATED TABLE users_info...<br>\n');
      page.write('CREATED TABLE status_info...<br>\n');
      page.write('CREATED TABLE model_info...<br>\n');
      page.write('CREATED TABLE countries...<br>\n');
      page.write('Done...<br>\n');
      page.write('</p>');
      page.write('</div>\n'); 
      page.footer();
      page.write('</html>\n'); 
      page.end(); 
    }); /* End serialize */
  });

  return;
}

/**
 *  \brief Add a new asset to the database.
 * 
 * @param {Object} res - HTTP server response object
 * @param {String} filename - Requested filename.
 */
function fileServer(res, filename) {
  console.log('File Server');
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      fs.readFile("./404.html", function(e, data404) {
        if (e) {
          return res.end('404 Not Found');
        }
        res.write(data404);
        return res.end();
      });
    }  else
    {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    }
  });
  return;
}
 
/**
 *  \brief Starts a new HTTP server on the given host using the supplied port number.
 * 
 * @param {Object} res - HTTP server response object
 * @param {String} filename - Requested filename.
 *
 **/
function startServer(hostname, port) {

  try {

    // Create HTTP server
    const server = http.createServer(function (req, res) {
      var q = url.parse(req.url, true);
      var filename = "." + q.pathname;
      page = new pageElements(res);

      if (!fs.existsSync(`./${database}`)) {
        /* No database so set one up */
        setup(page);
      } else
      {
        /* Database exists so process pages normally */
        switch(q.pathname) {
          case '/assets' :
              assets(page); 
              break;
          case '/models' :
              models(page); 
              break;
          case '/users' :
              users(page); 
              break;
          case '/add' :
              add(page);
              break;
          case '/' : // Go to the home page
              home(page);
              break;
          default:
              fileServer(res, filename);
        }
      }
    });

    /* Now listen to server */
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
  catch(error) {
    console.log('Error caught');
  }
}

// Start server instance
startServer(hostname, port);
console.log('Server Started...');
