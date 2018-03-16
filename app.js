/**
 * 
 * @file app.js
 * @namespace AssetDB
 * Module for loading and storing data
 */
 const http = require('http');
var url = require('url');
var fs = require('fs');

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
    this.res.write('\
  <nav class="navbar navbar-expand-lg navbar-light bg-light">\n\
    <a class="navbar-brand" href="#">Navbar</a>\n\
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
  </nav>\n');
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
    .button_create { padding: 5px 20px 0px;}\n\
  </style>\n');
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
    page.write('<div class="button_create" align="right">\n\  <a href="/" class="btn btn-primary"> <i class="icon-home icon-white"></i>Create</a>\n</div>');
    page.write('<div class="asset_table">\n'); 
    var table = '  <table class="table"> \n\
    <thead class="thead-dark"> \n\
      <tr> \n\
        <th scope="col">#</th> \n\
        <th scope="col">First</th> \n\
        <th scope="col">Last</th> \n\
        <th scope="col">Handle</th> \n\
      </tr> \n\
    </thead> \n\
    <tbody> \n\
      <tr> \n\
        <th scope="row">1</th> \n\
        <td>Mark</td> \n\
        <td>Otto</td> \n\
        <td>@mdo</td> \n\
      </tr> \n\
      <tr> \n\
        <th scope="row">2</th> \n\
        <td>Jacob</td> \n\
        <td>Thornton</td> \n\
        <td>@fat</td> \n\
      </tr> \n\
      <tr> \n\
        <th scope="row">3</th> \n\
        <td>Larry</td> \n\
        <td>the Bird</td> \n\
        <td>@twitter</td> \n\
      </tr> \n\
    </tbody> \n\
  </table>\n' 
  page.write(table); 
  page.write('  </div>\n</html>\n'); 
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
  page.write('Add Page');
  page.end();
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

      switch(q.pathname) {
        case '/assets' :
            assets(page); 
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

      console.log(q.pathname);
    });

    // Now listen to server
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
