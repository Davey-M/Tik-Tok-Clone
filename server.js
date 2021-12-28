const express = require('express');
const app = express();

require('dotenv').config();

const dataStore = require('nedb');
const key_db = new dataStore({ filename: __dirname + '/dbs/key.db' })
key_db.loadDatabase();
const user_db = new dataStore({ filename: __dirname + '/dbs/followers.db' })
user_db.loadDatabase();

const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Stores the current users followers into followers.db
app.post('/storeFollowing', (req, res) => {
    console.log(req.body);

    res.send(req.body);
})

// Inserts new user auth key into a database
app.post('/addKey', (req, res) => {

    console.log(req.body)
    
    key_db.insert({ auth: req.body.key })
    res.send({
        200: "success",
        body: req.body
    });
})

app.get('/keys', (req, res) => {
    let data = key_db.getAllData()

    res.send(data);
})

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