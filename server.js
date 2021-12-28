const express = require('express');
const app = express();

require('dotenv').config();

const dataStore = require('nedb');
const key_db = new dataStore({ filename: __dirname + '/dbs/key.db' })
key_db.loadDatabase();
const user_db = new dataStore({ filename: __dirname + '/dbs/followers' })
user_db.loadDatabase();

const port = process.env.PORT ?? 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.post('/addKey', (req, res) => {
    let existing_keys = key_db.getAllData()
    console.log(req.body)

    res.end();

    if (existing_keys.includes(req.body))
    {
        res.send('Error key already exists in database');
    }
    else
    {
        key_db.insert( { "key": req.body }, (err) => {
            if (err)
            {
                console.log(err);
                res.send(err);
            }
        } )
        res.send({ 200: 'Success' });
    }
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