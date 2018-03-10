var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	var campgrounds = [
		{name: "Caprock Canyon", image: "https://tpwd.texas.gov/state-parks/caprock-canyons/gallery/caprock-canyons_7035.jpg"},
		{name: "Palo Duro", image: "https://tpwd.texas.gov/state-parks/palo-duro-canyon/gallery/lighthouse-peak.jpg"},
		{name: "Pedernales Falls", image: "https://tpwd.texas.gov/state-parks/pedernales-falls/gallery/spotted-towhee"}
	]

	res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(5000, function() {
	console.log("Listening on port 5000..");
});
