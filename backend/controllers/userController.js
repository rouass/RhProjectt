const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const user = await userModel.findOne({ name: req.body.name });
    if (!user) {
      return res.status(200).send({ message: 'User not found', success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: 'Invalid email or password', success: false });
    }
    console.log("info de user" + user);
    const token = jwt.sign(
      {
        user: {
          username: user.name,
          email: user.email,
          id: user._id,
          isAdmin: user.isAdmin ,
        },
      },
      'p123',
      { expiresIn: '60m' }
    );

    console.log("Token: " + token);

    jwt.verify(token, 'p123', (err, decodedToken) => {
      if (err) {
        console.log('Token verification error:', err.message);
        return;
      }

      console.log('id from token: ' + decodedToken.user.id);
    });

    res.status(200).send({ message: 'Login Success', success: true, token, isAdmin: user.isAdmin, _id: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `loginController ${error.message}` });
  }
};


//notifications
exports.getNotReadenNotifications = async (req, res) => {
  try {
    const userId = req.query.userId; // Retrieve user ID from query parameters
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const notifications = user.notification;
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching notifications', success: false });
  }
};


exports.deleteNotification = async (req, res) => {
  try {
    const notificationIndex = req.params.notificationIndex; // Assuming you are passing the index as a parameter

    const userId = req.user.id; // Assuming you have implemented authentication middleware and attaching user to req

    // Find the user in the database by their ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the 'notification' array exists
    if (!user.notification || !Array.isArray(user.notification)) {
      return res.status(404).json({ success: false, message: 'User has no notifications' });
    }

    // Check if the notificationIndex is valid
    if (notificationIndex < 0 || notificationIndex >= user.notification.length) {
      return res.status(404).json({ success: false, message: 'Invalid notification index' });
    }

    // Remove the notification at the specified index
    user.notification.splice(notificationIndex, 1);

    // Save the updated user document
    await user.save();

    res.json({ success: true, message: 'Notification removed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Error in deleteNotification: ${error.message}` });
  }
};

exports.listerEmployee =(req , res)=>{
   if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'p123'); 
  const isAdmin = decodedToken.user.isAdmin ;
if(isAdmin){
  userModel.find().exec() 
   .then(conges => {
    res.status(200).json({ conges });
  })
  .catch(error => {
    res.status(400).json({ error });
  });
}
}











