const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, saucesCtrl.createSauce); // Création d'une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // Modification d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Suppression d'une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce); // Affichage d'une sauce
router.get('/', auth, saucesCtrl.getAllSauces); // Affichage de toutes les sauces

module.exports = router;