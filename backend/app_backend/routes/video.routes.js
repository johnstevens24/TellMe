const express = require('express');
const router = express.Router();

module.exports = app => {
    const videos = require("../controllers/video.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", videos.create);
  
    // Retrieve all Tutorials
    router.get("/", videos.findAll);
  
    // Retrieve all published users
    router.get("/published", videos.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", videos.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", videos.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", videos.delete);
  
    // Delete all Tutorials
    router.delete("/", videos.deleteAll);

    // get videos by a topic name
    router.get("/topics/:topic", videos.findByTopic);

    router.delete("/:id", videos.delete);

    // get number of videos that a user has posted
    // router.get("/postCount/:id", videos.postCount);
  
    app.use('/videos', router);  // first part of the url

    // Retrieve all the videos posted by one user
    router.get("/getUsersVideos/:id", videos.getUsersVideos)
  };