const express = require('express'),
	router = express.Router({mergeParams: true}),
	passport = require('passport'),
	User = require('../models/user');

//root route
router.get('/', (req, res) => {
	res.render('landing');
})

//show register form
router.get('/register', (req, res) => {
	res.render('register');
})
//handle signup logic
router.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', err.message)
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to YelpCamp ' + user.username.toUpperCase());
			res.redirect('/campgrounds');
		});
	});
})
//login form
router.get('/login', (req, res) => {
	res.render('login');
})
//login logic - handling data
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
}), (req, res) => {
});
//logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged you out!');
	res.redirect('/campgrounds');
})

module.exports = router;