const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/assets/js/uuid');
const database = require('mime-db');
// const util = require('util');

const PORT = process.env.PORT || 3001

const app = express();
// middleware?
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);
app.use(express.static('public'));


// GET Route for homepage (index.html) (why *?)
app.get('/',(req, res) =>
    res.sendFile(path.join(__dirname,'/public/index.html'))
); 

// GET Route for notes.html
app.get('/notes',(req, res) =>
    res.sendFile(path.join(__dirname,'/public/notes.html'))
); 

let readit = JSON.parse(fs.readFileSync('./db/db.json','utf-8'));
// get
app.get('/api/notes',(req,res)=>{
    res.json(readit);
})
// post
app.post('/api/notes',(req,res)=>{
    console.info(`${req.method} request recevied to ADD a note`);
    const {title,text} = req.body;
    if (title && text) {
        const newNote ={
            title,
            text,
            id: uuid()
        }
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
        readit.push(newNote);

        fs.writeFileSync('./db/db.json',JSON.stringify(readit));
        res.json(readit);
    } else {
        res.status(500).json('Error in posting review');
    }
    // let addNote = req.body;
})


app.listen(PORT,() =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);