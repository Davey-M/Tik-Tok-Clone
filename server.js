const express = require('express');
const app = express();

require('dotenv').config();

const port = process.env.PORT ?? 3000;

app.use(express.static(__dirname + '/public'))

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, (err) => {
    try {
        console.log(`App hosted on port: ${port}`);
    }
    catch (err)
    {
        console.log(err);
    }
})