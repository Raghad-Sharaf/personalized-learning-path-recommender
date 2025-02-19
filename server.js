// Setup empty JS object to act as endpoint
let projectData = {};

var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'))

console.log(__dirname);

const port = 3000;


// Post Route to handle user responses from from submission
app.post('/submit', addData);

function addData (req,res) {
    const userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
        return res.status(400).send({ error: 'Invalid data!' });
    }

    // Store trip data in projectData
    projectData = userData;
    
    res.json({ success: true, message: "Data received successfully", data: projectData });
    console.log(projectData);
}

app.get('/data', function (req, res) {
    res.json(projectData);
});

// Designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
 