// requires
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();


// middlewares
app.use(cors());
app.use(express.json());


// route to send all audio files to client
app.get('/sounds', function (req, res) {
    const folder = '../data/sounds';

    fs.readdir(folder, (err, files) => {
        res.json(files);
    });

});

// port
const port = 5000;

app.listen(port, () => {
    console.log('Server is running at http://localhost:5000');
})
