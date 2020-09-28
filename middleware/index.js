const Campground = require("../models/campground"),
	  Comment = require("../models/comment");

var middlewareObj = {};

// AUTHORIZATION
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// is user logged in
	if (req.isAuthenticated()) {
		Campground.foundById(req.params.id, function(err, foundCampground){
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			// does user own the campground?
			// foundCampground.author.id is an object
			// req.user._id is a string
			// they cannot be compared by === or ==
			if (foundCampground.author.id.equals(req.user._id)) {
				next();
				// res.render("/campgrounds/edit", {campground: foundCampground});
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
				// res.send("YOU DO NOT HAVE PERMISSION TO EDIT THIS CAMPGROUND!");
			}
		}
	});
	} else {
		// if not, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if (req.isAuthenticated()) {
		Comment.foundById(req.params.comment_id, function(err, foundComment){
		if (err) {
			res.redirect("back");
		} else {
			if (foundComment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
		}
	});
	} else {
		// if not, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	// flash(key, value) before redirect 
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;