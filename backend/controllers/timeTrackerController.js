const express = require('express');
const router = express.Router();
const timeTrackerModel = require('../models/timeTrackerModel');
const jwt = require('jsonwebtoken');

exports.createTimeTracker = async (req, res) => {
    try {
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
      }
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'p123');
  
      const newTimeTracker = new timeTrackerModel({
        userId: decodedToken.user.id,
        totalTimeWorking: req.body.totalTimeWorking, // Store as a string
        date: new Date().toLocaleDateString(), // Use the current date
      });
  
      await newTimeTracker.save();
  
      res.status(200).json({ success: true, message: 'TimeTracker created successfully' });
    } catch (error) {
      console.error('Error creating TimeTracker:', error);
      res.status(500).json({ success: false, error: 'An error occurred' });
    }
  };

  exports.listerListTimeTracker = (req, res) => {
    const selectedDate = req.query.date.date; // Access date from req.query.date.date
  
    timeTrackerModel
      .find({ date: selectedDate })
      .exec()
      .then(listTime => {
        res.status(200).json({ listTime });
      })
      .catch(error => {
        res.status(400).json({ error });
      });
  };
  
  
  

  
  