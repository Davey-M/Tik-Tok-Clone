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

    let { key, body } = req.body;

    user_db.findOne({ _id: key }, (err, doc) => {
        console.log('Docuemt:', doc);
        if (!doc)
        {
            console.log('Creating Doc')
            user_db.insert({ _id: key, body: body })
            res.send({
                200: 'Success',
                body: req.body,
            })
        }
        else
        {
            console.log('Updating Doc')
            user_db.update({ _id: key }, { $set: { body: body } } )
            res.send({
                200: 'Success',
                body: req.body,
            })
        }
    })
})

app.get('/test_endpoint', (req, res) => {
    user_db.find({ _id: '7853255518' }, (err, doc) => { 
        console.log(doc)
        res.send(doc);
    })
})

// Gets the follower data of any key you pass into it
app.post('/getFollowing', (req, res) => {

    // This is not a secure method of getting data usually there would be many layers of authentication before getting this data.
    let auth_key = req.body.key
    
    // let data = user_db.findOne({ _id: auth_key });

    if (user_db.count({ _id: auth_key }) < 1)
    {
        res.send('No data available for ' + auth_key);
    }
    res.send(user_db.findOne({ _id: auth_key }));
})

// Inserts new user auth key into a database
app.post('/addKey', (req, res) => {
    
    key_db.insert({ _id: req.body.key })
    console.log('New key created:', req.body);
    res.send({
        200: "Success",
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