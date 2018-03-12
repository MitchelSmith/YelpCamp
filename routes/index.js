var express 	= require("express"),
	passport	= require("passport")
	router 		= express.Router(),
	User 		= require("../models/user");

//Root Route
router.get("/", function(req, res) {
	res.render("landing");
});

//Register Form
router.get("/register", function(req, res) {
	res.render("register");
});

//Sign Up Route
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			res.render("/register");
		} else {
			passport.authenticate("local")(req, res, function() {
				res.redirect("/campgrounds");
			});
		}
	});
});

//Login Form
router.get("/login", function(req, res) {
	res.render("login");
});

//Login Route
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
});

//Logout Route
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.render("login");
	}
}

module.exports = router;