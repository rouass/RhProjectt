const express = require('express');
const router =express.Router();
const congeController = require('../controllers/congeController');
const authMiddleware = require('../middlewares/authMiddleware');


// Route to list conges, with authMiddleware as middleware

router.post('/ajouter' ,  authMiddleware ,congeController.ajouterConge);
router.post('/verifier' , congeController.dispoConge);
router.get('/lister', authMiddleware, congeController.listerConge);
router.post('/updateStatus/:congeId' , congeController.updateCongeStatus)


module.exports = router ; 