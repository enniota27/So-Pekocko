const multer = require('multer'); // Enregistrer les images

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // Enregistrer sur le disque
  destination: (req, file, callback) => { // Dossier où l'on enregistre
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // Nom du fichier
    const name = file.originalname.split(' ').join('_'); // Nouveau nom = nom d'origine sans espace
    const extension = MIME_TYPES[file.mimetype]; // Extension = élement du dicto
    callback(null, name + Date.now() + '.' + extension); // Nom entier = nom + date + . + extension
  }
});

module.exports = multer({storage: storage}).single('image'); // Fichier unique image