//all the middleware goes here
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
    }
    req.flash('error', 'You need to be logged in to do that!')
	res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                //does user own campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that!');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                //does user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that!');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }
}

module.exports = middlewareObj;