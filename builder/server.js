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
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);



// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
  res.render('pages/start');
});

// Define a route to render the login page
app.get('/build', (req, res) => {
  res.render('pages/index');
});

// Define a route to render the login page
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// Define a route to render the login page
app.get('/create-account', (req, res) => {
  res.render('pages/create-account');
});


// Route for handling login form submission
app.post('/login', (req, res) => {
  // Handle login logic here
  // Redirect to project selection page after login
  res.redirect('/project-selection');
});

// Route for handling create account form submission
app.post('/select-user-type', (req, res) => {
  // Handle account creation logic here
  // Redirect to project selection page after account creation
  res.redirect('/project-selection');
});

// Define a route to render the login page
app.get('/project-selection', (req, res) => {
  res.render('pages/project-selection');
});
