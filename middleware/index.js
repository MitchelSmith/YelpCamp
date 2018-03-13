var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err || !foundCampground) {
				console.log(err);
				req.flash("error", "Sorry, that campground doesn't exist!");
				res.redirect("/campgrounds");
			} else if(foundCampground.author.id.equals(req.user._id)) {
				req.campground = foundCampground;
				next();
			} else {
				req.flash("error", "You don't have permission to do that.")
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err || !foundComment) {
				console.log(err);
				req.flash("error", "Sorry, that comment doesn't exist.");
				res.redirect("/campgrounds");
			} else if(foundComment.author.id.equals(req.user._id)) {
				req.comment = foundComment;
				next();
			} else {
				req.flash("error", "You don't have permission to do that.")
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.")
		res.redirect("back");
	}
}

module.exports = middlewareObj;
