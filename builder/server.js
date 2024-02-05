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

var mongodbRest = require('mongodb-rest/server.js');

// MongoDB REST configuration:
var mongodbRestConfiguration = {
  "db": "mongodb+srv://admin:admin@cluster0.yj4kiww.mongodb.net/?retryWrites=true&w=majority",
  "endpoint_root": "server",
  "server": {
    "port": 3001,
    "address": "0.0.0.0"
  },
  "accessControl": {
    "allowOrigin": "*",
    "allowMethods": "GET,POST,PUT,DELETE,HEAD,OPTIONS",
    "allowCredentials": false
  },
  "dbAccessControl": {},
  "mongoOptions": {
    "serverOptions": {
    },
    "dbOptions": {
      "w": 1
    }
  },
  "humanReadableOutput": true,
  "urlPrefix": "",
  "schema": {
    "foo_database": {
      "collection1": {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$id": "http://json-schema.org/draft-06/schema#",
        "type": "object",
        "properties": {
          "value": {
            "$id": "/properties/value",
            "type": "boolean",
            "title": "Foo boolean value",
            "description": "An explanation about the purpose of this instance.",
            "default": false,
            "examples": [
              false
            ]
          }
        }
      }
    }
  }
}

mongodbRest.startServer(mongodbRestConfiguration);

// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
  res.render('pages/index');
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.yj4kiww.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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

