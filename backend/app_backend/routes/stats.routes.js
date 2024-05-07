module.exports = app => {
	const stats = require("../controllers/stats.controller.js");
  
	var router = require("express").Router();
  
	router.get("/correctlyVoted/:userId", stats.calculateUserChosenVideoProportion);
    router.get("/numVotedOnUserPolls/:userId", stats.countUserVotesOnTheirVideos);
    router.get("/timesVoted/:userId", stats.countUserVotesOnOtherVideos);
    router.get("/topTopicByUser/:userId", stats.findMostVotedTopicByUser);
    router.get("/topTopic", stats.findMostPopularTopic);
    router.get("/userRanking/:userId", stats.findUserRankingByVotes);

  
	app.use("/stats", router);  // first part of the url


};