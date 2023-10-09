const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const congeRouter = require('./routes/congeRouter');
const userRouter = require('./routes/userRoutes');
const pointageRouter = require('./routes/pointageRouter');
const timeTrackerRouter = require('./routes/timeTracker');

app.use(express.json());
app.use(cors());

app.use('/conge', congeRouter)
app.use('/user' , userRouter)
app.use('/pointage',pointageRouter);
app.use('/timeTracker', timeTrackerRouter);

// Connexion à la base de données
mongoose.connect('mongodb://127.0.0.1:27017/stage', {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log("Connexion à la base de données établie");
});

db.on('error', (err) => {
  console.log("Erreur de connexion à la base de données", err);
});

app.listen(8000, () => {
  console.log("Serveur démarré avec succès !");
});


