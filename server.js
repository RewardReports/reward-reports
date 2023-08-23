const express = require('express');
const path = require('path');
const fetch = require('node-fetch');


const app = express();

app.use(express.static(path.join(__dirname, '')));

const port = 3000;


app.get('/github-proxy', async (req, res) => {
  try {
    // Replace with the actual GitHub API URL
    const githubUrl = 'https://api.github.com/repos/RewardReports/reward-reports/contents/builder/testFiles';

    const response = await fetch(githubUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});