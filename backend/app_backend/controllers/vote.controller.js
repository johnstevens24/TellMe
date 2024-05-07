const db = require("../models");
const Vote = db.votes;
const Option = db.options;
const Op = db.Sequelize.Op;

// Create and Save a new vote
exports.create = async (req, res) => {
	try {
		const { user_id, video_id, option_id, vote_date } = req.body;

		const [newVote, created] = await Vote.findOrCreate({
			where: { user_id: user_id, video_id: video_id },
			defaults: { option_id: option_id, vote_date: vote_date }
		});

		if (!created) {
			// If the vote already exists, update it
			await Vote.update(
				{ option_id: option_id, vote_date: vote_date },
				{ where: { user_id: user_id, video_id: video_id } }
			);
		}

		res.status(201).json(newVote);
	} catch (error) {
		console.error("Error creating or updating Vote:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

  

// Retrieve all videos from the database.
exports.findAll = async (req, res) => {
	try {
		const votes = await Vote.findAll();
		res.json(votes);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
  
};

exports.findOne = (req, res) => {
	const id = req.params.id;

	Vote.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.send(null); // Return null if no vote is found
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Vote with id=" + id
			});
		});
};

exports.findByVidId = (req, res) => {
	const vid_id = req.params.id;

	Vote.findAll({
		where: {
			video_id: vid_id,
		},
	})
		.then(data => {
			if (data.length > 0) {
				res.send(data);
			} else {
				res.send(null); // Send null if no data found
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Votes with video_id=" + vid_id
			});
		});
};



exports.voteResults = async (req, res) => {
	try {
		const videoId = req.params.vid_id;
  
		// Query all options associated with the given videoId
		const options = await Option.findAll({
			where: { video_id: videoId },
			attributes: ["id", "option"], // Select only the id and option attributes
		});
  
		// Query votes for the given videoId
		const votes = await Vote.findAll({
			where: { video_id: videoId },
			attributes: ["option_id"], // Select only the option_id
		});
  
		// Count the votes for each option
		const voteCounts = {};
		votes.forEach(vote => {
			const optionId = vote.option_id;
			if (!voteCounts[optionId]) {
				voteCounts[optionId] = 0;
			}
			voteCounts[optionId]++;
		});
  
		// Create results array with vote counts and option texts
		const results = options.map(option => {
			const count = voteCounts[option.id] || 0;
			const proportion = count / votes.length;
			return {
				id: option.id,
				option: option.option,
				proportion: proportion,
				votes: count,
			};
		});
  
		res.json({
			results: results,
			totalVotes: votes.length
		});
	} catch (error) {
		console.error("Error retrieving vote results:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.findByUserId = async (req, res) => {
	try {
		const userId = req.params.user_id;
		const votes = await Vote.findAll({
			where: { user_id: userId },
		});

		if (!votes || votes.length === 0) {
			return res.send(null); // Send null if no data found
		}

		res.json(votes);
	} catch (error) {
		console.error("Error retrieving votes by user ID:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Delete a video with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all videos from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published videos
exports.findAllPublished = (req, res) => {
  
};

exports.hasVoted = async (req, res) => {
	try {
		const { user_id, video_id } = req.params;

		// Check if there's a vote with the given user_id and video_id
		const existingVote = await Vote.findOne({
			where: { user_id: user_id, video_id: video_id }
		});

		// If a vote exists, user has voted; otherwise, user hasn't voted
		const hasVoted = !!existingVote;
    
		res.json({ hasVoted });
	} catch (error) {
		console.error("Error checking if user has voted:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};