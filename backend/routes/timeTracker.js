const express = require('express');
const router =express.Router();
const timeTarckerController = require('../controllers/timeTrackerController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/ajouterTimeTracker'  , timeTarckerController.createTimeTracker , authMiddleware);
router.get('/listerListTimeTracker'  , timeTarckerController.listerListTimeTracker );


module.exports = router ; 
