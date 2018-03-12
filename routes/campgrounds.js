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
router.post("/", function(req, res) {
	var name = req.body.name;
	var desc = req.body.description;
	var image = req.body.image;
	var newCampground = {name: name, description: desc, image: image};

	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//New Route
router.get("/new", function(req, res) {
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

module.exports = router;