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
app.listen(process.env.PORT);

const mongodbUri = "mongodb+srv://admin:admin@cluster0.yj4kiww.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create Mongooose schema and model
const ReportSchema = new mongoose.Schema({
  date: String,
  markdownContent: String
});

const Item = mongoose.model('Item', ItemSchema);

app.use(bodyParser.json()); // Middleware to parse JSON data



// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
  res.render('pages/index');
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/*
const client = new MongoClient(mongodbUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Provide the name of the database and collection you want to use.
    // If the database and/or collection do not exist, the driver and Atlas
    // will create them automatically when you first write data.
    const dbName = "rewardReportsDB";
    const collectionName = "reports";

    // Create references to the database and collection in order to run
    // operations on them.
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Make sure to call close() on your client to perform cleanup operations
    await client.close();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

// *** POST Routes - handle form submissions ***
// POST route for the form on the 'View Changes' tab
app.post('/saveReport', async (req, res) => {
  try {
    const newReport = new Report(req.body);
    const savedItem = await newReport.save();
    res.status(200).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error saving item', error });
  }
});
         