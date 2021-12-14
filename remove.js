// storage of notes 
const readToFile = util.promisify(fs.readFile)
const writeToFile = util.promisify(fs.writeFile)

class Storage {
    readit() {
        return readToFile('db/db.json',"utf8")
    }
    writeit() {
        return writeToFile('db/db.json', JSON.stringify(note))
    }
    getNotes(){
        return this.readit()
        .then(notes =>{
            return JSON.parse(notes) || [];
        })
    }
    saveNote(){
        const {title,text} = paper
        if (!title || !text) {
            throw new Error('you must have both a title and text!')
        }
        const newNote ={
            title,
            text,
            id: uuid()
        }
        return this.getNotes()
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
// get 
app.get('/api/notes',(req,res)=> {
    Storage
        .getNotes()
        .then(notes => {
            res.json(notes)
        })
        .catch(err => {
            res.status(500).json(err)
        }) 
});
// post
app.post('/api/notes',(req,res)=>{
    // Log that a POST request was received
    console.info(`${req.method} request recevied to ADD a note`);
    Storage
        .saveNote(req.body)
        .then(paper => {
            res.json(paper)
        })
        .catch(err => {
            res.status(500).json(err)
        })
});
// delete
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