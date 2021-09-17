const express = require('express');
const mysql = require('mysql');

// Create Connection
const db = mysql.createConnection({
    host: 'localhost',
    database: 'pastebin-clone'
});

// Connect to Database
db.connect((error) => { if (error) throw error; });

const app = express();
app.use(express.json());
const PORT = '3000';

app. use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    next();
});


// Routes
app.post('/createPastesTable', (req, res) => {
    console.log('CREATING TABLE....');
    const newQuery = "CREATE TABLE IF NOT EXISTS pastes ( title VARCHAR(50), text VARCHAR(10000) );";
    db.query(newQuery, (error, result) => {
        if(error) throw error;
        res.send('success');
    });
});

app.post('/insertInto', (req, res) => {
    console.log('INSERTING INTO > DATABASE');
    let newQuery = '';
    try {
        const values = req.body.values.reduce( (values = '', value) =>  values + ', ' + value );
        newQuery = 'INSERT INTO ' + 
                    req.body.tableName + 
                    ' VALUES ' + 
                    values + 
                    ';';
    } catch (error) {
        res.send(error.message);
    }
    db.query(newQuery, (error, result) => {
        if(error) throw error;
        res.send('success');
    });
});

app.get('/selectData', (req, res) => {
    const newQuery = 'SELECT ' + req.body.argument + 
                    ' FROM ' + 
                    req.body.tableName + 
                    ' ' + 
                    req.body.specifications + 
                    ';';
    db.query(newQuery, (error, result) => {
        if(error) throw error;
        res.send(result);
    });
});

// Start Server
app.listen(PORT);