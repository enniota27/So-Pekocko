const bcrypt = require('bcrypt'); // Hachage
const jwt = require('jsonwebtoken'); // Token
const User = require('../models/User');

// Enregistre un nouveau utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Hacher/crypter le mdp en 10 tours
      .then(hash => {
        const user = new User({ // Création d'un nouveau utilisateur
          email: req.body.email,
          password: hash
        });
        user.save() // Enregistre dans la base de donnée
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Connection d'un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Trouver l'utilisateur
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // Compare le hache du mdp de la base de donnée avec l'entrée de l'utilisateur
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id, // Renvoie son identifiant
            token: jwt.sign( // Renvoie un Token
                { userId: user._id },
                'J791kSfwn8Wh3ZhR1S9J',
                { expiresIn: '24h' }
              )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};