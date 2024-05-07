const express = require('express');
const router = express.Router();

module.exports = app => {
    const options = require("../controllers/option.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", options.create);
    
    router.post("/upvote/:id", options.upvote);
    router.post("/downvote/:id", options.downvote);    

    router.post("/undoUpvote/:id", options.undoUpvote);
    router.post("/undoDownvote/:id", options.undoDownvote);    
  
    // Retrieve all Tutorials
    router.get("/", options.findAll);
  
  
    // Retrieve a single Tutorial with id
    router.get("/:id", options.findOne);

    // get all options for a particular video
    router.get("/vid/:id", options.findByVidId);
  
    app.use('/options', router);  // first part of the url
  };