const express 	= require('express'),
	app 		= express(),
	bodyParser 	= require('body-parser'),
	mongoose 	= require('mongoose'),
	flash 		= require('connect-flash'),
	passport	= require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	Campground 	= require('./models/campground'),
	Comment 	= require('./models/comment'),
	User 		= require('./models/user'),
	seedDB		= require('./seeds');

// requiring routes
const	commentRoutes 		= require('./routes/comments'),
		campgroundRoutes 	= require('./routes/campgrounds'),
		indexRoutes 		= require('./routes/index');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL) //local server
//mongoose.connect("mongodb://natashalaws:ScillieS93@ds113098.mlab.com:13098/yelp-camp"); //mlab server
process.env.databaseURL
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); //seed the database

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
})

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);


app.listen(process.env.PORT || 3000);





