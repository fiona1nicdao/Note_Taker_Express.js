const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/assets/js/uuid');
const util = require('util');
// do i need this?
// const api = require('./public/assets/js/index');
// routes? 

const PORT = process.env.PORT || 3001

const app = express();
// Do I need middleware?
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);
app.use(express.static('public'));
// routes for middleware? 


// GET Route for homepage (index.html) (why *?)
app.get('/',(req, res) =>
    res.sendFile(path.join(__dirname,'/public/index.html'))
); 

// GET Route for notes.html
app.get('/notes',(req, res) =>
    res.sendFile(path.join(__dirname,'/public/notes.html'))
); 
// storage of notes 
const readToFile = util.promisify(fs.readFile)
const writeToFile = util.promisify(fs.writeFile)
class Storage {
    readit() {
        return readToFile('db/db.json')
    }
    writeit() {
        return writeToFile('db/db.json', JSON.stringify(note))
    }
    getNote(){
        return readit()
        .then(notes =>{
            return JSON.parse(notes) || [];
        })
    }
    addNote(){
        const {title,text} = paper
        if (!title || !text) {
            throw new Error('you must have both a title and text!')
        }
        const newNote ={
            title,
            text,
            id: uuid()
        }
        return this.getNote()
            .then(notes => [...notes,newNote])
            .then(updatedNotes => this.writeit(updatedNotes))
            .then(()=> this.newNote)
    }
    removeNote(id) {
        return this.getNotes()
            .then(notes => notes.filter(paper => paper.id !== id))
            .then(keepNotes => this.writeit(keepNotes))
    }
}
// const storage = Storage
app.get('/api/notes',(req,res)=> {
    Storage
        .getNote()
        .then(notes => {
            res.json(notes)
        })
        .catch(err => {
            res.status(500).json(err)
        }) 
});

app.post('/api/notes',(req,res)=>{
    // Log that a POST request was received
    console.info(`${req.method} request recevied to ADD a note`);
    Storage
        .addNote(req.body)
        .then(paper => {
            res.json(paper)
        })
        .catch(err => {
            res.status(500).json(err)
        })
});
// app.delete
app.delete('/api/notes/:id',(req, res)=>{
    console.info(`${req.method} request recevied to DELETE a note`);
    Storage
        .removeNote(req.params.id)
        .then(()=>{
            res.json({ok:true})
        })
        .catch(err => {
            res.status(500).json(err)
        })
})
app.listen(PORT,() =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);