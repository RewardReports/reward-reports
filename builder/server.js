// Load Node modules
var express = require('express');
const ejs = require('ejs');
// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
// Listen on port specified in 'PORT' environment variable:
// https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
app.listen(process.env.PORT);

// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
  res.render('pages/index');
});
