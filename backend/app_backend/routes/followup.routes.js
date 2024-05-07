const express = require('express');
const router = express.Router();

module.exports = app => {
    const followups = require("../controllers/followup.controller.js");

    // Define routes
    router.post("/", followups.create);
    router.get("/", followups.findAll);
    router.get("/:id", followups.findOne);
    router.put("/:id", followups.update);
    router.delete("/:id", followups.delete);
    router.delete("/", followups.deleteAll);
    router.get("/getUsersFollowUps/:userId", followups.findByUser);
    router.get("/getVotedFollowups/:userId", followups.findFollowUpsByUserVotes);
    router.get("/findByVideo/:videoId", followups.findByVideo);

    // Register routes with the application
    app.use('/followups', router);
};
