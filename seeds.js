const mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
	  User = require("./models/user"),
	  Comment = require("./models/comment");

const user = new User({
	username: "YelpCamp",
	password: "password"});
user.save(function(err){
	if (err) {
		console.log(err);
	}
});


var data = [
    {
        name: "Cloud's Rest",
		price: "10",
		author: user,
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
		author: user,
		price: "15",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
		author: user,
		price: "7",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
	// remove all campgrounds
	Campground.remove({}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("removed campgrounds!");
			// add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err) {
						console.log(err);
					} else {
						console.log("added a campground");
						// create a comment
						Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: user
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
									// associate the comment to the campground
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
					}
				})
			});
		}
	});
	
	
}

module.exports = seedDB;

