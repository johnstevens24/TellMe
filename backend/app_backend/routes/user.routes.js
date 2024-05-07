module.exports = app => {
	const users = require("../controllers/user.controller.js");
  
	var router = require("express").Router();
  
	// Create a new Tutorial
	router.post("/", users.create);
  
	router.get("/test", users.testLogin);
  
	// Retrieve all Tutorials
	router.get("/", users.findAll);
  
	// Retrieve all published users
	router.get("/published", users.findAllPublished);
  
	// Retrieve a single Tutorial with id
	router.get("/:id", users.findOne);
  
	// Update a Tutorial with id
	router.put("/:id", users.update);
  
	// Delete a Tutorial with id
	router.delete("/:id", users.delete);
  
	// Delete all Tutorials
	router.delete("/", users.deleteAll);

	// get number of videos that a user has posted
	router.get("/postCount/:id", users.postCount);

	// User login
	router.post("/login", users.login);

	router.put("/updateEmail/:id", users.updateEmail);
	router.put("/updatePassword/:id", users.updatePassword);
	router.put("/updateProfilePicture/:id", users.updateProfilePicture);
	router.put("/updateUsername/:id", users.updateUsername);
  
	app.use("/users", router);  // first part of the url


};