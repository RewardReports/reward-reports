// Load Node modules
var express = require('express');
const axios = require('axios');
const ejs = require('ejs');
// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);


app.get('/polis-proxy', async (req, res) => {
  try {
    const response = await axios.get('https://pol.is/report/r3rrm8rpttsfvxfwnaz7b');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching content: ' + error);
  }
});

// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
  res.render('pages/index');
});
