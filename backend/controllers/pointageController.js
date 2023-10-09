const express = require('express');
const router = express.Router();
const pointage = require('../models/poinatgeModel');
const pointageModel = require('../models/poinatgeModel');
const jwt = require('jsonwebtoken');

exports.listerPointage = (req, res) => {
  /*if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'p123');
  const userId = decodedToken.user.id;*/

  const currentDate = new Date().toLocaleDateString('en-GB'); 

  pointageModel
    .find({ date: currentDate }) /*userId , */ 
    .exec()
    .then(pointages => {
      res.status(200).json({ pointages });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

  

exports.modifyPointage = async (req, res) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'p123'); 
    const userId = decodedToken.user.id;

    const pointageRecord = await pointageModel.findOne({ userId, heureFP:null }).exec();
    console.log(pointageRecord ) ; 
    if (!pointageRecord) {
      return res.status(404).json({ success: false, message: 'No pointage record found with heureDF set to null' });
    }

    await pointageModel.updateOne(
      { _id: pointageRecord._id },
      { $set: { heureFP: req.body.heureFP } }
    );

    console.log('Updated Pointage Record:', pointageRecord);

    res.status(201).json({ success: true, data: pointageRecord });
  } catch (error) {
    console.error('Error updating pointage record:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};



exports.createPointage = async (req, res) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'p123'); 

    const newPointage = new pointage({
      type: req.body.type,
      heureDP: req.body.heureDP,
      heureDF: null,
      date: req.body.date,
      userId: decodedToken.user.id,
      numFois: req.body.numFois ,
    });

    await pointageModel.create(newPointage);
    await newPointage.save();

    res.status(200).json({ success: true, message: 'Pointage created successfully' });
  } catch (error) {
    console.error('Error creating pointage:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
};


exports.listerFirstPointage = async(req, res)=>{
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'p123');
  const userId = decodedToken.user.id;
  const currentDate = new Date().toLocaleDateString('en-GB');
  pointageModel
  .find({ userId,  numFois: 0 ,  date: currentDate  }) 
  .exec()
  .then(pointages => {
    res.status(200).json({ pointages });
  })
  .catch(error => {
    res.status(400).json({ error });
  });
}

