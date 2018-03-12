var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	app 			= express(),
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User			= require("./models/user"),
	seedDB			= require("./seeds");

//Requiring Routes
var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
})

app.get("/", function(req, res) {
	res.render("landing");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(5000, function() {
	console.log("Listening on port 5000..");
});
