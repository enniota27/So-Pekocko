const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser pour extraire des objets JSON en JS
const mongoose = require('mongoose'); // Import mongosse pour la base de donnée
const path = require('path'); // Donne accès aux chemins d'un fichier

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express(); //Permet de créer une application express

mongoose.connect('mongodb+srv://Antoine27:mdp27@cluster0.4ly8p.mongodb.net/pekocko?retryWrites=true&w=majority', // Connection à la base de donnée
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => { // Ajoute CORS dans l'entête de toutes les requêtes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Verbe que l'on autorise
    next();
  });

app.use(bodyParser.json()); // Tranforme le corps de la requête en objet JS pour toutes les routes

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes); // /api/sauces = racine des routes
app.use('/api/auth', userRoutes);

module.exports = app;