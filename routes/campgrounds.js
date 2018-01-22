const express = require('express'),
	router = express.Router({mergeParams: true}),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware');

// INDEX ; show all campgrounds
router.get('/', (req, res) => {
	//Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
})
// CREATE ; add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
	// get data from form and add to campgrounds database
	let name = req.body.name;
	let image = req.body.image;
	let price = req.body.price;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, price: price, author: author};
	//Create a new campground and save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else { //redirect back to campgrounds page
			req.flash('success', 'Successfully created campground!');
			res.redirect('/campgrounds');
		}
	})
})
// NEW ; displays form to add new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
})
// SHOW ; shows more info about one campground
router.get('/:id', (req, res) => {
	// Find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
})
//EDIT; edit a campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render('campgrounds/edit', {campground: foundCampground});
	})
})

//UPDATE; update the campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	// find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully updated campground!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})

//DESTROY; delete a campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully deleted campground!');
			res.redirect('/campgrounds')
		}
	})
})

module.exports = router;