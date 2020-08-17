var 	express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose");

//built-in path module required for sendFile()
var path = require('path');

//body-parser parses <body> in POST routes

//mongoose.connect('mongodb://username:password@host:port/database?options...', {useNewUrlParser: true});
//change username 'superuser' and pwd 'somePassword' according to the users in db admin
mongoose.connect('mongodb://superuser:somePassword@localhost:27017/feedback?authSource=admin', {useUnifiedTopology: true, useNewUrlParser: true}).then(() => console.log('Connected to MongoDB!')).catch(error => console.log(error.message));

//MongoDB--------------------------------------------------------------------------------------------------------
//schema setup
var feedbackSchema = new mongoose.Schema({
	name: String,
	date: String,
	email: String,
	user: String,
	form: String
})

//Feedback is based on the schema feedbackSchema
var Feedback = mongoose.model("Feedback", feedbackSchema);

app.use(bodyParser.urlencoded({extended: true}));

//assume ejs in /views
app.set("view engine", "ejs");

//setting up the public directory (first in from Learning Chemistry)
//__dirname is the working directory of app.js
app.use(express.static(__dirname + '/public'));
//all static file calls are relative to public so no need to include /public in the src or href tag
app.use(express.static(__dirname + '/views'));

//main directories
app.get("/", function(req, res){
	res.render("index");
});

app.get("/about", function(req, res){
	res.render("about");
});

app.get("/contact", function(req, res){
	res.render("contact");
});

app.get("/feed/rss2", function(req, res){
	res.sendFile('rss.xml', { root: path.join(__dirname, '/public/feed') });
});

app.get("/feed/atom1", function(req, res){
	res.sendFile('atom.xml', { root: path.join(__dirname, '/public/feed') });
});

app.get("/Reply", function(req, res){
	res.render("reply");
});

app.get("/readFeedback", function(req, res){
	Feedback.find({}, function(err, feedbacks){
		if(err){
			console.log("Feedback data could not be retrieved and displayed");
			console.log(err);
		} else {
			console.log("Feedback data retrieved and displayed");
			//send feedbacks to feedback.ejs and app.post("/feedback")
			res.render("feedback", {feedbackEJS:feedbacks});
		}
	});
});

//POST routes (names independent of GET routes)
app.post("/reply", function(req, res){
	//get data: date, email_input, userType and form_input from the Contact page (need body-parser to use HTML tag names)
	
	var check = req.body.humans;
	if(check !== ""){
		console.log("Found another HIT");
	} else {
		//get UTC date
		var date = new Date().toUTCString();

		var name = req.body.name_input,
			email = req.body.email_input,
			 user = req.body.userType,
			 form = req.body.form_input;
		console.log(date + " feedback submitted from " + name + ", " + email + " - " + user + " - " + form);

		//add mongoDB related methods
		var newFeedback = {date: date, name: name, email: email, user: user, form: form};
		Feedback.create(newFeedback, function(err, newData){
		if(err){
			console.log("Could not upload form data from Contact page");
			console.log(err);
		} else {
			//redirect to success page (by default, a GET request) after posting
			console.log(date + " feedback uploaded OK: " + name + ", " + email + " - " + user + " - " + form);
			res.redirect("/reply");
		}
	});
		
	}
});

app.get("/:someDir", function(req, res){
//article list ---------------------------------------------------------------------------------------------------
	const articles = ["1_halfequations","2_DescribingEntropy", "3_OxidationStates", "4_Resonance", "5_HistoryOfElectrons",
	"6_AtomicSpectroscopy", "7_AtomicOrbitals", "8_MixingOrbitals", "9_Hybridisation", "10_CurlyArrows", "11_ElementaryReactions", 
	"12_IdealAndNonIdeal", "13_EnthalpyEntropyChanges", "14_GibbsFreeEnergy"
	];
//----------------------------------------------------------------------------------------------------------------
	if(articles.includes(req.params.someDir)){
		res.render(req.params.someDir);
	} else res.render("PageNotFound");
});

//Page not found
app.get("*", function(req, res){
	res.render("PageNotFound");
});

//Listener
var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("LearningChemistry has started! CTRL-C to exit.");
});