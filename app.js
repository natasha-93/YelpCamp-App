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

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { useMongoClient: true })
	.then(() => console.log(`Database connected`))
	.catch(err => console.log(`Database connection error: ${err.message}`)); //local server + mlab server

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//seedDB(); //seed the database

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





