const Sauce = require('../models/Sauce');
const fs = require('fs'); // Avoir accès à des opérations liés aux systèmes de fichiers

// Création d'une sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	const sauce = new Sauce({
    	...sauceObject, // Copie
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // http://localhost3000/images/nomdufichier
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked : [],
	});
	sauce.save() // Enregistre l'objet dans la base
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ? // Modifier l'url de l'image
		{
			...JSON.parse(req.body.sauce),
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : { ...req.body };
	if (req.file) { // Si on charge une nouvelle image, on doit supprimer l'ancienne
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				const filename = sauce.imageUrl.split('/images/')[1]; // Nom de l'ancienne image
				fs.unlink(`images/${filename}`,() => {})}) // Supprime l'ancienne image
			.catch((error) => { res.status(500).json({ error });});
			};
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // { objet de comparaison },{ ancien objet : nouveau objet }
		.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
		.catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({	_id: req.params.id })
		.then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1]; // Nom de l'image
		fs.unlink(`images/${filename}`, () => { // Supprime l'image
			Sauce.deleteOne({ _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Sauce supprimée !'	}))
				.catch(error => res.status(400).json({ error }));
		});
	})
		.catch(error => res.status(500).json({ error }));
};

// Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({	_id: req.params.id }) // Récupérère que la sauce dont l'id est la même que l'url
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};

// Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find() // Récupére le tableau de tous les sauces de la base
		.then(sauces => res.status(200).json(sauces))
		.catch(error => res.status(400).json({ error }));
};

// Like/dislike une sauce
exports.likedSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then(sauce => {
		// Like
		if (req.body.like == 1 && ((sauce.usersLiked.find(userId => userId == req.body.userId)) && (sauce.usersDisliked.find(userId => userId !== req.body.userId))) == undefined) { // Vérification que l'userId n'est pas dans usersLiked ni dans usersDisliked
			var sauceObject =
				{ 
					...JSON.parse(req.body.like),
					$push: { usersLiked: req.body.userId },
					$inc: { likes: +1 }
				};
			var message = "Sauce liké";
		};
		// Dislike
		if (req.body.like == -1 && ((sauce.usersLiked.find(userId => userId == req.body.userId)) && (sauce.usersDisliked.find(userId => userId !== req.body.userId))) == undefined) {
			var sauceObject =
				{
					...JSON.parse(req.body.like),
					$push: { usersDisliked: req.body.userId	},
					$inc: { dislikes: +1 }
				};
			var message = "Sauce disliké";
		};
		// Annule le like ou dislike
		if (req.body.like == 0) {
			// Annule le like si l'id de l'utilisateur est dans usersLiked
			if (sauce.usersLiked.find(userId => userId == req.body.userId)) {
				var sauceObject = 
					{
						...JSON.parse(req.body.like),
						$pull: { usersLiked: req.body.userId },
						$inc: { likes: -1 }
					};
				var message = "Like annulé";
			};
			// Annule le dislike si l'id de l'utilisateur est dans usersDisliked
			if (sauce.usersDisliked.find(userId => userId == req.body.userId)) {
				var sauceObject = 
					{
						...JSON.parse(req.body.like),
						$pull: { usersDisliked: req.body.userId },
						$inc: { dislikes: -1 }
					};
				var message = "Dislike annulé";
			};
		};
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // { objet de comparaison },{ ancien objet : nouveau objet }
	.then(() => res.status(200).json({ message: message }))
	.catch(error => res.status(400).json({ error }));
	});
};