const congeModel = require('../models/congeModel');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


exports.listerConge = (req, res) => {
      // Check if the authorization header is present
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
      }
  
      // Extract token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];
      // Verify the token using your secret key
      const decodedToken = jwt.verify(token, 'p123'); // Replace 'your_secret_key' with the actual secret key used to sign the token
      const isAdmin = decodedToken.user.isAdmin ;
     
  const userId = req.user.id;
if(!isAdmin){
  congeModel.find({ userId }).exec()
    .then(conges => {
      res.status(200).json({ conges });
    })
    .catch(error => {
      res.status(400).json({ error });
    });}
    else {congeModel.find().exec()
    .then(conges => {
      res.status(200).json({ conges });
    })
    .catch(error => {
      res.status(400).json({ error });
    });}



};


exports.dispoConge = (req, res) => {
  const dateD = new Date(req.body.dateD);
  const dateF = new Date(req.body.dateF);

  const differenceMs = dateF.getTime() - dateD.getTime();
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  const available = differenceDays < 10;
  const message = available ? "La différence est inférieure à 10 jours." : "La différence est supérieure ou égale à 10 jours.";

  res.json({ available, message });
};




exports.ajouterConge = async (req, res) => {
  try {
    // Check if the authorization header is present
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
    }

    // Extract token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using your secret key
    const decodedToken = jwt.verify(token, 'p123'); // Replace 'your_secret_key' with the actual secret key used to sign the token

    const congeObj = { 
      type: req.body.type,
      dateD: req.body.dateD,
      dateF: req.body.dateF,
      cause: req.body.cause,
      userId: decodedToken.user.id ,
    };
    const userName = decodedToken.user.username;
    const createdConge = await congeModel.create(congeObj);
    const congeId = createdConge._id ; 
    console.log("id"+ congeId);
    // Find the admin user
    const adminUser = await userModel.findOne({isAdmin: true});
    

    if (adminUser) {
      // Add the notification to the admin user's notifications array
      adminUser.notification.push({
        type: 'nouveau demande de congé',
        message: `type : ${congeObj.type}  période de :   ${congeObj.dateD}   ${congeObj.dateF} demandé par ${ decodedToken.user.username}`,
        data: {
          userId: congeObj.userId,
          congeId: createdConge._id,
          name: congeObj.type,
          userName :  decodedToken.user.username,
          dateD: congeObj.dateD ,
          dateF : congeObj.dateF,
         
        }
      });

      // Save the updated admin user
      await adminUser.save();
    }

    res.status(201).json({
      success: true,
      message: 'Conge applied successfully',
      createdConge
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Error in ajouterConge: ${error.message}` });
  }
};





exports.updateCongeStatus = async (req, res) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
    }

    // Extract token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using your secret key
    const decodedToken = jwt.verify(token, 'p123'); // Replace 'your_secret_key' with the actual secret key used to sign the token

    // Extract congeId and status from the request body
    const { congeId } = req.params;
    const { status } = req.body;


    // Validate that the status is either 'confirmed' or 'rejected'
    if (status !== 'confirmed' && status !== 'rejected') {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }
    console.log(congeId)
    // Find the conge by its ID
    const conge = await congeModel.findById(congeId);

    // Check if the conge exists
    if (!conge) {
      return res.status(404).json({ error: 'Conge not found.' });
    }

    // Update the status
    conge.status = status;

    // Save the updated conge
    await conge.save();

    // Send notification to the user
    const user = await userModel.findById(conge.userId);
    if (user) {
      const notification = {
        type: 'réponse pour la demande de congé',
        data: {
          status: conge.status,
          congeId: conge._id,
          dateD: conge.dateD,
          dateF: conge.dateF,
          type: conge.type,
        },
      };

      user.notification.push(notification);
      await user.save();
    }

    // Return the updated conge
    return res.json({ message: 'Conge status updated successfully.', conge });
  } catch (error) {
    console.error('Error updating conge status:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};







