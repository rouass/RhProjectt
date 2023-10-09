const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.get('/notifications', userController.getNotReadenNotifications);
router.get('/lister', userController.listerEmployes);
router.post('/ajouter', userController.createEmploye);
router.get('/listerHoliday', userController.listerTwoHolidays);

router.delete('/deleteNotification/:notificationId' ,authMiddleware, userController.deleteNotification);
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).send({ message: 'Protected route accessed successfully', userId: req.body.userId });
});

module.exports = router;
