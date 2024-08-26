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
// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
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
  full_name: String,
  organization_email: String,
  organization_id: mongoose.Schema.Types.ObjectId,
  // user_type: mongoose.Schema.Types.ObjectId,
});

const UserType = new mongoose.Schema({
  type_name: String, // 'Client', 'Vendor', etc.
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  organization_id: mongoose.Schema.Types.ObjectId,
});



const Report = mongoose.model('Report', ReportSchema);
const Organization = mongoose.model('Organization', OrganizationSchema);
const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

app.use(bodyParser.json()); // Middleware to parse JSON data



// *** GET Routes - REST APIs ***

// Get list of all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects', error });
  }
});

// Get list of all organizations
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching organizations', error });
  }
});

// Get list of all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', error });
  }
});

// Get list of all report versions
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

// GET route for loading existing reports
// TODO: deprecate in favor of '/reports/:projectId' (look-up by project ID)
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

// *** GET Routes - Pages ***

// Root Route
app.get('/', function(req, res) {
  res.render('pages/start');
});

// Define a route to render the report builder page
app.get('/build/:projectId', async (req, res) => {
  res.render('pages/index', { projectId: req.params.projectId });
});

// Define a route to render the login page
app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get('/create-account', (req, res) => {
  res.render('pages/create-account');
});

// *** POST Routes - handle form submissions ***

// Create user
app.post('/create-user', (req, res) => {
  console.log("Create account request: ", req);
  User.create({
    username: req.body.username,
    organization_email: req.body.organization_email,
    organization_id: req.body.organization_id,
    full_name: req.body.full_name,
  })
    .then(savedUser => {
      console.log('User created successfully:', savedUser);
    })
    .catch(error => {
      console.error('Error creating user:', error);
    });
  return res.redirect('/login');
});

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

// POST route for creating new project in an organization
app.post('/createProject', async (req, res) => {
  console.log(req);
  try {
    const newProject = new Project(req.body);
    console.log("created project object");
    const savedItem = await newProject.save();
    console.log("saved project object");
    res.status(200).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Clear existing report versions
app.post('/clear', async (req, res) => {
  try {
    await Report.deleteMany({});
    res.status(200).json({ message: 'All reports deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting reports', error });
  }
})

// Route for handling login form submission
app.post('/login', async (req, res) => {
  // Handle login logic here
  var organization_email = req.body.organization_email;
  try {
    var user = await User.findOne({ organization_email: organization_email });
    // Redirect to project selection page after login
    res.redirect('/project-selection/' + user._id);
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', error });
  }
});

// Route for handling create account form submission
app.post('/select-user-type', async (req, res) => {
  // Handle account creation logic here
  // Redirect to project selection page after account creation
  res.redirect('/project-selection');
});

// Define a route to render the login page
app.get('/project-selection/:userId', async (req, res) => {
  try {
    var user = await User.findOne({ _id: req.params.userId });
    var organization = await Organization.findOne({ _id: user.organization_id });
    res.render('pages/project-selection', { user: user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user', error });
  }
});


