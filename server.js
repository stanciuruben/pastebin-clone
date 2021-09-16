const express = require('express');
const mysql = require('mysql');

// Create Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'anypassword',
    database: 'pastebin-clone'
});

// Connect to Database
db.connect((error) => { if (error) throw error; });

const app = express();
app.use(express.json());
const PORT = '3000';

// Routes
app.post('/createtable', (req, res) => {
    let newQuery = '';
    try {
        const rows = req.body.rows.reduce( (rows = '', row) =>  rows + ', ' + row );
        newQuery = 'CREATE TABLE IF NOT EXISTS ' + 
                    req.body.tableName + 
                    ' (' + 
                    rows + 
                    ');';
    } catch (error) {
        res.send(error.message);
    }
    db.query(newQuery, (error, result) => {
        if(error) throw error;
        res.send(true);
    });
});

app.post('/insertinto', (req, res) => {
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
        res.send(true);
    });
});

app.get('/selectdata', (req, res) => {
    let newQuery;
    try {
        const arguments = req.body.arguments.reduce( (argumentsList = '', argument) =>  argumentsList + ', ' + argument );
        newQuery = 'SELECT ' + arguments + 
                    ' FROM ' + 
                    req.body.tableName + 
                    ' ' + 
                    req.body.specifications + 
                    ';';

    } catch (error) {
        res.send(error.message);
    }
    db.query(newQuery, (error, result) => {
        if(error) throw error;
        res.send(result);
    });
});

// Start Server
app.listen(PORT);