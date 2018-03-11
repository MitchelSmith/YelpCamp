var express 	= require("express"),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	app 		= express();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{name: "Palo Duro", image: "https://tpwd.texas.gov/state-parks/palo-duro-canyon/gallery/lighthouse-peak.jpg"
// 	}, function(err, campground) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			console.log("New Campground: " + campground);
// 		}
// 	});

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds: campgrounds});
		}
	})
});

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};

	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});

app.listen(5000, function() {
	console.log("Listening on port 5000..");
});
