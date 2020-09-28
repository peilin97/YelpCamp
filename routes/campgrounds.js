const express = require("express"),
	  router = express.Router(),
	  middleware = require("../middleware"),
	  Campground = require("../models/campground");

// add all routes to router
// INDEX route - shows all campgrounds
router.get("/", function(req, res) {
	
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds});
		}
	});
});

// CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	const name = req.body.name,
		  price = req.body.price,
		  image = req.body.image,
		  desc = req.body.description,
		  author = {
			id: req.user._id,
			username: req.user.username
		  },
		  newCampground = {name: name,
						   price: price,
						   image: image,
						   description: desc,
						   author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW route - shows the form that create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// SHOW route - shows the info about one campground
// SHOW must be placed after NEW
router.get("/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.foundById(req.params.id, function(err, foundCampground){
		res.render("/campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findById(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			// redirect show page
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
	
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.foundByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;