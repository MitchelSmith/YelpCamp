var express = require("express");
var router 	= express.Router({mergeParams: true});
var Campground  = require("../models/campground"),
	Comment 	= require("../models/comment"),
	middleware 	= require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			if(!campground) {
				req.flash("error", "Item not found.");
				return res.redirect("back");
			}
			res.render("comments/new", {campground: campground});
		}
	});
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong.");
			res.redirect("/campgrounds");
		} else {
			if(!campground) {
				req.flash("error", "Item not found.");
				return res.redirect("back");
			}
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					if(!comment) {
						req.flash("error", "Item not found.");
						return res.redirect("back");
					}
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment.");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});

//Edit Route
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			req.flash("error", "Comment not found.")
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
});

//Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			req.flash("error", "Comment not found.")
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Delete Route
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
 	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
 		if(err) {
 			req.flash("error", "Comment not found.")
 			res.redirect("back");
 		} else {
 			req.flash("success", "Comment deleted.")
 			res.redirect("/campgrounds/" + req.params.id);
 		}
 	});
 });

module.exports = router;

