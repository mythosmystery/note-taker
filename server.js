const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const dbPath = './db/db.json';

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));
app.get("/api/notes", (req, res) => res.sendFile(path.join(__dirname, dbPath)));

app.post("/api/notes", (req, res) => {
    let stringNotes = [];
    const newNote = req.body;
    newNote.id = Date.now();
    const jsonNotes = JSON.parse(fs.readFileSync(dbPath));    
    jsonNotes.push(newNote);    
    stringNotes = JSON.stringify(jsonNotes);
    // console.log(stringNotes);
    fs.writeFile(dbPath, stringNotes, (err) => {
        if(err) throw err;
        console.log("Writing complete");
        res.json({status:"success"});
    });
    
});
app.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const jsonNotes = JSON.parse(fs.readFileSync(dbPath));
    const index = jsonNotes.findIndex(x => x.id == id);
    jsonNotes.splice(index, 1);    
    const stringNotes = JSON.stringify(jsonNotes);
    // console.log(stringNotes);
    fs.writeFile(dbPath, stringNotes, (err) => {
        if(err) throw err;
        console.log("Deleted Item");
        res.json({status:"success"});
    });
})

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});