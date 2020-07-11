const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Répurére le token après l'espace
    const decodedToken = jwt.verify(token, 'J791kSfwn8Wh3ZhR1S9J');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error('Requête non authentifiée !') });
  }
};