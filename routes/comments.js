const express = require('express'),
	router = express.Router({mergeParams: true}),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware');

//comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
	//find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground});
		}
	})
})
//comments create
router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => { //lookup campground using ID
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comment) => { //create comment
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment._id); //connect one comment to campground
					campground.save();
					req.flash('success', 'Successfully created comment!');
					res.redirect('/campgrounds/' + campground._id); //redirect
				}
			})
		}
	})
})
//edit comment
router.get('/:comment_id/edit', (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			res.redirect('back');
		} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
		}
	})
})
//update comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Comment successfully updated!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})
//DESTROY; delete a comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})

module.exports = router;