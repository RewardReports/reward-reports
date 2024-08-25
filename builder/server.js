// Load Node modules
var express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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



const mongodbUri = "mongodb+srv://admin:admin@cluster0.yj4kiww.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create Mongooose schemas and models
const ReportSchema = new mongoose.Schema({
  datetime: String,
  markdownContent: String,
  project_id: mongoose.Schema.Types.ObjectId,
});

const OrganizationSchema = new mongoose.Schema({
  name: String,
  parent_organization_id: mongoose.Schema.Types.ObjectId,
});

const UserSchema = new mongoose.Schema({
  username: String,
  organization_email: String,
  organization_id: mongoose.Schema.Types.ObjectId,
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  organization_id: mongoose.Schema.Types.ObjectId,
});



const Report = mongoose.model('Report', ReportSchema);
const Organization = mongoose.model('Organization', OrganizationSchema);
const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('User', ProjectSchema);

app.use(bodyParser.json()); // Middleware to parse JSON data



// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
  res.render('pages/start');
});

// Define a route to render the login page
app.get('/build', (req, res) => {
  res.render('pages/index');
});

// *** POST Routes - handle form submissions ***
// POST route for the form on the 'View Changes' tab
app.post('/saveReport', async (req, res) => {
  console.log("POST route for the form on the 'View Changes' tab");
  console.log(req);
  try {
    const newReport = new Report(req.body);
    console.log("created report object");
    const savedItem = await newReport.save();
    console.log("saved report object");
    res.status(200).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error saving item', error });
  }
});


// *** GET Routes - load data ***
// GET route for loading existing reports
app.get('/loadReportVersions', async (req, res) => {
  console.log("GET route for the form on the 'View Changes' tab");
  console.log(req);
  try {
    const items = await Report.find({});
    console.log("found items")
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error loading items', error });
  }
});


app.get('/clear', async (req, res) => {
  try {
    await Report.deleteMany({});
    res.status(200).json({ message: 'All reports deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting reports', error });
  }
})

// Define a route to render the login page
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// Define a route to render the login page
app.get('/create-account', (req, res) => {
  User.create({
    username: req.body.username,
    organization_email: req.body.organization_email,
    organization_id: req.body.organization_id,
  })
    .then(savedUser => {
      console.log('User created successfully:', savedUser);
    })
    .catch(error => {
      console.error('Error creating user:', error);
    });
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

// Define a route to render the login page
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects', error });
  }
});

// Define a route to render the login page
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching organizations', error });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', error });
  }
});

app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reports', error });
  }
});


// Route for looking up the projects under an organization, using 
// a parameter for the organization id:
app.get('/projects/:organizationId', async (req, res) => {
  try {
    const projects = await Project.find({ organization_id: req.params.organizationId });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects', error });
  }
});


// Route for looking up the reports under a project, using
// a parameter for the project id:
app.get('/reports/:projectId', async (req, res) => {
  try {
    const reports = await Report.find({ project_id: req.params.projectId });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reports', error });
  }
});

