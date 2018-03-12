var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

// Index Route
router.get("/", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
		}
	})
});

//Create Route
router.post("/", isLoggedIn, function(req, res) {
	var name = req.body.name;
	var desc = req.body.description;
	var image = req.body.image;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, description: desc, image: image, author:author};

	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//New Route
router.get("/new", isLoggedIn, function(req, res) {
	res.render("campgrounds/new.ejs");
});

//Show Route
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Edit Route
router.get("/:id/edit", function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

//Update Route
router.put("/:id", function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy Route
router.delete("/:id", function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.render("login");
	}
}

module.exports = router;