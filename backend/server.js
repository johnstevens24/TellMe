const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

var corsOptions = {
	origin: "http://localhost:8080"  
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app_backend/models");
const Role = db.role;

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to server backend." });
	console.log("connected to server");
	
});

// routes
require("./app_backend/routes/user.routes.js")(app);
require("./app_backend/routes/video.routes.js")(app);
require("./app_backend/routes/option.routes.js")(app);
require("./app_backend/routes/vote.routes.js")(app);
require("./app_backend/routes/followup.routes.js")(app);
require("./app_backend/routes/report.routes.js")(app);
require("./app_backend/routes/stats.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

function initial() {
	Role.create({
		id: 1,
		name: "user"
	});
 
	Role.create({
		id: 2,
		name: "moderator"
	});
 
	Role.create({
		id: 3,
		name: "admin"
	});
}