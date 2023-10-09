const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel'); // Import your Mongoose model

// Create a new note
router.post('/notes', (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  newNote.save((err, note) => {
    if (err) {
      res.status(500).json({ error: 'Error creating note' });
    } else {
      res.status(201).json(note);
    }
  });
});

// Get all notes
router.get('/notes', (req, res) => {
  Note.find({}, (err, notes) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching notes' });
    } else {
      res.status(200).json(notes);
    }
  });
});

// Update a note
router.put('/notes/:id', (req, res) => {
  Note.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true },
    (err, note) => {
      if (err) {
        res.status(500).json({ error: 'Error updating note' });
      } else {
        res.status(200).json(note);
      }
    }
  );
});

// Delete a note
router.delete('/notes/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting note' });
    } else {
      res.status(204).end();
    }
  });
});

module.exports = router;
