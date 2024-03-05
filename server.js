const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Get existing notes
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
        
    });
});

// Save a new note
app.post("/api/notes", (req, res) => {
    
     fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading notes data' });
        }
        const notes = JSON.parse(data );
        const newNote = req.body;
        newNote.id = notes.length + 1; // Assign a unique ID
        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes, null,"\t"), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error writing new note' });
            }
            res.json(newNote);
        });
    });
});
// Delete a note
app.delete("/api/notes/:id", (req, res) => {
    const noteId = parseInt(req.params.id);
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error Deleting Note' });
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(204).send();
        });
    });
});

// HTML routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
