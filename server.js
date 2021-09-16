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
db.connect((error) => {
    if (error) {
        throw error;
    }
    console.log("MySql Connected!");
});

const app = express();
const port = '3000';

// Starting Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});