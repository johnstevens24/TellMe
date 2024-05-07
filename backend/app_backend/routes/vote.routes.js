const express = require('express');
const router = express.Router();

module.exports = app => {
    const votes = require("../controllers/vote.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", votes.create);
  
    // Retrieve all Tutorials
    router.get("/", votes.findAll);

    router.get("/votesByUser/:user_id", votes.findByUserId)
  
  
    // Retrieve a single Tutorial with id
    router.get("/:id", votes.findOne);

    // get all options for a particular video
    router.get("/vid/:id", votes.findByVidId);

    router.get("/results/:vid_id", votes.voteResults);

    router.get("/has_voted/:video_id/:user_id", votes.hasVoted)
  
    app.use('/votes', router);  // first part of the url
  };