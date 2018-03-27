/**
 * 
 * @file page.js
 * @namespace app 
 * @author Ross Newman <ross@rossnewman.com>
 */

 /** This is the Markdown Design Bootstrap initalisation code */
 mdbootstrap = `\
 <meta charset="utf-8">\
 <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n\
 <meta http-equiv="x-ua-compatible" content="ie=edge">\n\
 <title>${this._sitename}</title>\n\
 <!-- Font Awesome -->\n\
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">\n\
 <!-- Bootstrap core CSS -->\n\
 <link href="css/bootstrap.min.css" rel="stylesheet">\n\
 <!-- Material Design Bootstrap -->\n\
 <link href="css/mdb.min.css" rel="stylesheet">\n\
 <!-- Your custom styles (optional) -->\n\
 <link href="css/style.css" rel="stylesheet">\n`
  
/**
 * Page class used to render the main page components in HTML
 */
class page {

  /**
   * Page constructor
   * @constructor
   * @param {object} res the HTTP response object for rendering the current page.
   * @param {string} site the name of this website.
   * @param {string} webmaster email address for support issues.
   */
  constructor(res, site, webmaster) {
    this.res = res;
    this._sitename = site;
    this._email = webmaster;
    this.res.writeHead(200, {'Content-Type': 'text/html'});
  }

  /**
   * Write the HTTP data to write to the current page.
   * @param {string} string
   */
  write(string) {
    this.res.write(string);
  }
 

  /**
   * Finalise the current page so that it can be fully rendered.
   */
  end() {
    this.res.end();
  }

  /**
   * Output the page header..
   */
  head() {
    this.res.write(`<head>\n`);
    this.styles();
    this.res.write(mdbootstrap);
    this.res.write(`</head>\n`);
  }

  /**
   * Ganerate the code for the navigation bar at the top of the screen.
   * @param {Object} res - HTTP server response object
   */
  navbar() {
    this.res.write(`\
  <nav class="navbar navbar-expand-lg navbar-light bg-light">\n\
    <a class="navbar-brand" href="#">${this._sitename}</a>\n\
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
   * Ganerate the code for custome style.
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
    .agenda .agenda-date { width: 170px; }\n\
    .agenda .agenda-date .dayofmonth {\n\
      width: 40px;\n\
      font-size: 36px;\n\
      line-height: 36px;\n\
      float: left;\n\
      text-align: right;\n\
      margin-right: 10px; \n\
    }\n\
    .agenda .agenda-date .shortdate {\n\
      font-size: 0.75em; \n\
    }\n\
    .jumbotron {\n\
      color:#FFFFFF; \n\
      background-color:#212529; \n\
    }\n\
      \n\
  </style>\n');
  }
  
  header(pagename, button, uri) {
    this.res.write(`\
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
  <div class="footer-copyright py-3 text-center">Author: ${this._email} \n\
    <a href="https://github.com/ross-newman/asset-tracker">\n\
        <strong>${this._sitename}</strong>\n\
    </a> v0.1.0\n\
  </div>\n\
</footer>\n`);
  }
};

module.exports = page;