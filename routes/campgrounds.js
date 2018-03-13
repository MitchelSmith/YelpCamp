var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// Index Route
router.get("/", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user, page: "campgrounds"});
		}
	})
});

//Create Route
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var desc = req.body.description;
	var price = req.body.price;
	var image = req.body.image;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, description: desc, price:price, image: image, author:author};

	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//New Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new.ejs");
});

//Show Route
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err || !foundCampground) {
			console.log(err);
			req.flash("error", "Sorry, that campground doesn't exist!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", {campground: foundCampground});
	});
});

//Edit Route
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			req.flash("error", "Campground not found.");
		}
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			req.flash("error", "Campground not found.");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
			req.flash("error", "Campground not found.");
		} else {
			req.flash("success", "Campground deleted.")
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;