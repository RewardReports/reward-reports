const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});