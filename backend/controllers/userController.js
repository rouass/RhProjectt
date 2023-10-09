const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const holidays = [
  { name: 'New Year', date: '2023-01-01' },
  { name: 'Independence Day', date: '2023-03-20' },
  { name: 'MatrysDay', date: '2023-22-04' },
  { name: 'Aid El-Fitr', date: '2023-04-22' },
  { name: 'Labour Day', date: '2023-05-01' },
  { name: 'Aid El Kebir', date: '2023-06-29' },
  { name: 'Aid El Kebir', date: '2023-06-30' },
  { name: 'Aid El Kebir', date: '2023-07-01' },
  { name: 'Republic Day', date: '2023-07-25' },
  { name: 'Women Day', date: '2023-08-13' },
  { name: 'Prophet Mohammed Birdhday', date: '2023-09-27' },
  { name: 'Evacuation Day', date: '2023-10-15' },
  { name: 'Revolution and youth Day', date: '2023-10-17' },

];

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

exports.createEmploye = async (req, res) => {
  const userObj= {
    name : req.body.name,
    email: req.body.email,
    password: req.body.password, 
    dateD: req.body.dateD,
    tel: req.body.tel,
    isAdmin: false ,
    isActive: false ,
    /*file,
    image,*/
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
  if (!userObj.email.match(emailRegex)) {
    res.status(400).json({ message: "Invalid email format." });
    return;
  }
  const hashedPassword = await bcrypt.hash(userObj.password, 10);

  try {
    // Vérifiez si un employé avec la même adresse e-mail existe déjà
    const existingEmployee = await userModel.findOne({ email: userObj.email.toLowerCase() });
    if (existingEmployee) {
      res.status(400);
      throw new Error("An employee with this email already exists!");
    }
        // Créez l'employé en associant l'ID de l'utilisateur actuel
        const employe = await userModel.create({
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
         /* file: userObj.file,
          image: userObj.image,*/
          password: hashedPassword,
          dateD: userObj.dateD,
          tel: userObj.tel ,
          isActive : userObj.isActive,
          isAdmin: userObj.isAdmin, 
        });

        console.log("Created employe:", employe);
        res.status(201).json(employe);
      
    
  } catch (error) {
    // Gérez l'erreur ici en affichant les détails de l'erreur
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "An error occurred while creating an employee" });
  }
};

exports.updateEmploye = async(req,res)=>{
  const employe = await userModel.findById(req.params._id);
  if (!employe) {
      res.status(404);
      throw new Error ('Employe not found!');
      }
      if(employe.isAdmin !==true){
        res.status(403);
        throw new Error ("user don't have permission to update other user's employees");
    }

  const updatedEmploye = await userModel.findByIdAndUpdate(
      req.params._id,
      req.body,
      {new:true}
  );
  res.status(200).json(updatedEmploye);
}

exports.listerEmployes = (req, res) => {
  userModel.find().exec()
.then(employes => {
  res.status(200).json({ employes });
})
.catch(error => {
  res.status(400).json({ error });
});};

exports.listerTwoHolidays =(req, res) => {
  // Get the current date
  const currentDate = new Date();

  // Filter and sort holidays that occur after the current date
  const upcomingHolidays = holidays
    .filter((holiday) => new Date(holiday.date) > currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Select the next two holidays
  const nextTwoHolidays = upcomingHolidays.slice(0, 2);

  // Format the response
  const formattedHolidays = nextTwoHolidays.map((holiday) => ({
    name: holiday.name,
    date: holiday.date,
  }));

  // Send the response as JSON
  res.json(formattedHolidays);
};


