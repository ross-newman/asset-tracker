/**
 * 
 * @file app.js
 * @fileOverview The main application an http server implementation
 * @namespace app 
 * @author Ross Newman <ross@rossnewman.com>
 * @version 0.1.0
 */
var sqlite3 = require('sqlite3').verbose();
const http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var Sync = require('sync');
const page = require('./page.js');
const logging = require('./logging.js');

/**
 * The global application logging object 
 */
var mylog;

/**
 * Enable some additional debugging featured to be enabled 
 */
 var DEBUG = 1;

/**
 * The default hostname of the server 
 * @constant
 * @type {string}
 * @default 
 */
const hostname = '127.0.0.1'; 

/** 
 * \var port 
 * \brief The default port number of the server 
 */
const port = 3000; 

/** 
 * \var email
 * \brief The contact email address of the site author/s 
 */
const email = "ross@rossnewman.com"

/** 
 * The name of this web application 
 * @param {Object} page -  - HTTP server response object
 */
const sitename = "Asset Tracker"

/** 
 * The default database name 
 * @param {Object} page -  - HTTP server response object
 **/
const database = "database.db"

/** 
 * Boot strap code and stylesheet 
 * @param {Object} page -  - HTTP server response object
 */
let bootstrap_min = '<link rel="stylesheet" href="/node_modules/mdbootstrap/css/bootstrap.min.css">\n\
<script src="/node_modules/jquery/dist/jquery.slim.min.js" </script>\n\
<script src="/node_modules/mdbootstrap/js/bootstrap.min.js" </script>\n'

/**
 * Home page and welcome screen.
 * @function
 * @author: Ross Newman
 * @param {Object} page -  - HTTP server response object
 */
function page_home(page) {
  console.log('Home Page');
  page.write(bootstrap_min);
  page.write('<html lang="en">\n');
  page.head();
  page.write('<body>');
  page.navbar();
  page.write('<div class="jumbotron text-center">\n\
  <h1>Asset Tracker</h1>\n\
  <p>The simple asset management and tracking tool (ALPHA).!</p> \n\
</div>\n\
\n\
<div class="container">\n\
  <div class="row">\n\
    <div class="col-sm-8">\n\
      <h3>Recent Activity</h3>\n\
      <p>');
  mylog.display();
  page.write('\
      </p>\n\
    </div>\n\
    <div class="col-sm-4">\n\
      <h3>Deployed Assets</h3>\n\
      <p>This is the home of your asset dashboard.</p>\n\
      <p>As you populate the database your will see more usefull information about deployes asstes here.</p>\n\
      <canvas id="doughnutChart"></canvas>\n\
    </div>\n\
  </div>\n\
</div>\n');
page.footer();
page.write('\
    <!-- SCRIPTS -->\n\
    <!-- JQuery -->\n\
    <script type="text/javascript" src="/node_modules/mdbootstrap/js/jquery-3.2.1.min.js"></script>\n\
    <!-- Bootstrap tooltips -->\n\
    <script type="text/javascript" src="/node_modules/mdbootstrap/js/popper.min.js"></script>\n\
    <!-- Bootstrap core JavaScript -->\n\
    <script type="text/javascript" src="/node_modules/mdbootstrap/js/bootstrap.min.js"></script>\n\
    <!-- MDB core JavaScript -->\n\
    <script type="text/javascript" src="/node_modules/mdbootstrap/js/mdb.min.js"></script>\n\
\n\
</body>\n\
</html>\n');
page.write('\
<script>\n\
var ctxD = document.getElementById("doughnutChart").getContext("2d");\n\
var myLineChart = new Chart(ctxD, {\n\
    type: "doughnut",\n\
    data: {\n\
        labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],\n\
        datasets: [\n\
            {\n\
                data: [300, 50, 100, 40, 120],\n\
                backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],\n\
                hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]\n\
            }\n\
        ]\n\
    },\n\
    options: {\n\
        responsive: true\n\
    }   \n\
});\n\
</script>\n\
\n'); 
  page.end(); 
  return;
}

/**
 * List the assets.
 * @function
 * @param {Object} page - HTTP server response object
 */
function page_assets(page) {
    console.log('Assets selected');
    page.write(bootstrap_min);
    page.write('<html lang="en">\n');
    page.head();
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
 * Add a new asset to the database.
 * @function
 * @param {Object} page - HTTP server response object
 */
function page_models(page) {
  console.log('Models selected');
  page.write(bootstrap_min);
  page.write('<html lang="en">\n');
  page.head();
  page.navbar();
  page.header("Models", "Create New", "/");
  page.footer();
  page.write('</html>\n'); 
  page.end(); 
  return;
}

/**
 * Add a new asset to the database.
 * @function
 * @param {Object} page - HTTP server response object
 */
function page_users(page) {
  console.log('Users selected');
  page.write(bootstrap_min);
  page.write('<html lang="en">\n');
  page.head();
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
function page_add(page) {
  console.log('Add selected');
  page.write(bootstrap_min);
  page.write('<html lang="en">\n');
  page.head();
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
function page_setup(page) {
  console.log('Add selected');
  page.write(bootstrap_min);
  page.write('<html lang="en">\n');
  page.head();
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
  if (DEBUG) {
    console.log('File Server : ' + "http://" + hostname + ":" + port + filename.slice(1,filename.length));
  }
  var filePath = '.' + filename;
  if (filePath == './')
      filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
      case '.js':
          contentType = 'text/javascript';
          break;
      case '.css':
          contentType = 'text/css';
          break;
      case '.json':
          contentType = 'application/json';
          break;
      case '.png':
          contentType = 'image/png';
          break;      
      case '.jpg':
          contentType = 'image/jpg';
          break;
      case '.ico':
          contentType = 'image/ico';
          break;
  }

  fs.readFile(filename, function(err, data) {
    if (err) {
      fs.readFile("./404.html", function(e, data404) {
        if (e) {
          return res.end('404 Not Found');
        }
        res.write(data404);
        return res.end();
      });
    }  else
    {
      res.writeHead(200, {'Content-Type': contentType});
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
  try 
  {
    // Create HTTP server
    const server = http.createServer(function (req, res) 
    {
      var q = url.parse(req.url, true);
      var filename = "." + q.pathname;
      const mypage = new page(res, sitename, email);

      /* Start Logging */
      mylog = new logging(mypage);

      if (!fs.existsSync(`./${database}`)) {
        /* No database so set one up */
        setup(page);
      } else
      {
        /* Database exists so process pages normally */
        switch(q.pathname) {
          case '/assets' :
            page_assets(mypage); 
            break;
          case '/models' :
            page_models(mypage); 
            break;
          case '/users' :
            page_users(mypage); 
            break;
          case '/add' :
           page_add(mypage);
            break;
          case '/' : // Go to the home page
          page_home(mypage);
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

