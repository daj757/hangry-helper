var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var handlebars = require('handlebars');
var exphbs = require("express-handlebars");

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
	defaultLayout: 'main',
    helpers: {
        format: function (text) { 
        	// text = handlebars.escapeExpression(text);
        	text = text.split(";").join("</li><li>");
    		text = text.replace(/['"]+/g, '');
			console.log("__________________________________")
    		console.log(text)
   		 return new handlebars.SafeString("<li>" + text + "</li>");
        	
        }
    }
});



app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Routes
// =============================================================
//NOT SURE WHICH ONE IS NEEDED - THE FIRST ROUTE IS FROM SEQUELIZE EXAMPLE, THE SECOND IS FROM A HANDLEBARS EXERCISE
require("./routes/api-routes.js")(app);
// var routes = require("./controllers/foodController.js");
// app.use("/", routes);
// Syncing our sequelize models and then starting our Express app
// =============================================================
// IF YOU HAVE AN EXISTING DB USE THIS LINE INSTEAD...    db.sequelize.sync({force: true}).then(function() {

	db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("App listening on PORT " + PORT);
	});
});
