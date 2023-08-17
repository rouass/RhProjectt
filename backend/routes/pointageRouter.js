const express = require('express');
const router =express.Router();
const pointageController = require('../controllers/pointageController');
const authMiddleware = require('../middlewares/authMiddleware');



router.post('/ajouter'  , pointageController.createPointage , authMiddleware);
router.post('/modifier'  , pointageController.modifyPointage, authMiddleware);
router.get('/lister'  , pointageController.listerPointage, authMiddleware);



module.exports = router ; 
