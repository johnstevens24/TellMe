const db = require("../models");
const FollowUp = db.followups;
const Vote = db.votes;
const Op = db.Sequelize.Op;

// Create and Save a new follow up video
exports.create = async (req, res) => {
	try {
		// Assuming req.body contains the necessary data, adjust accordingly
		const { datePosted, userId, videoId, followupData, thumbnail, chosenId } = req.body;

		// Create a new follow up entry
		const newFollowUp = await FollowUp.create({
			date_posted: datePosted,
			user_id: userId,
			video_id: videoId,
			followup_data: followupData,
			thumbnail: thumbnail,
			chosen_id: chosenId
		});

		res.status(201).json(newFollowUp);
	} catch (error) {
		console.error("Error creating follow up:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Retrieve all follow ups from the database.
exports.findAll = async (req, res) => {
	try {
		const followUps = await FollowUp.findAll();
		res.json(followUps);
	} catch (err) {
		console.error("Error retrieving follow ups:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Find a single follow up with an id
exports.findOne = async (req, res) => {
	const id = req.params.id;

	try {
		const followUp = await FollowUp.findByPk(id);
		if (followUp) {
			res.send(followUp);
		} else {
			res.status(404).send({ message: `Cannot find Follow Up with id=${id}` });
		}
	} catch (err) {
		console.error(`Error retrieving Follow Up with id=${id}:`, err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.findByUser = async (req, res) => {
	const userId = req.params.userId;
  
	try {
		const followups = await FollowUp.findAll({
			where: {
				user_id: userId
			}
		});
  
		if (followups.length > 0) {
			res.json(followups);
		} else {
			res.status(404).send({
				message: `No follow-up videos found for user with id=${userId}.`
			});
		}
	} catch (error) {
		console.error("Error retrieving follow-up videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.findByVideo = async (req, res) => {
	const videoId = req.params.videoId;

	try {
		const followUps = await FollowUp.findAll({
			where: {
				video_id: videoId,
			},
		});

		if (followUps.length > 0) {
			res.send(followUps);
		} else {
			res.send(null);
		}
	} catch (err) {
		console.error(`Error retrieving follow ups for video with id=${videoId}:`, err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Update a follow up by the id in the request
exports.update = async (req, res) => {
	const id = req.params.id;
	const { datePosted, userId, videoId, followupData, thumbnail, chosenId} = req.body;

	try {
		const numUpdated = await FollowUp.update({
			date_posted: datePosted,
			user_id: userId,
			video_id: videoId,
			followup_data: followupData,
			thumbnail: thumbnail,
			chosen_id: chosenId
		}, {
			where: { id: id }
		});

		if (numUpdated == 1) {
			res.send({ message: "Follow Up was updated successfully." });
		} else {
			res.status(404).send({ message: `Cannot update Follow Up with id=${id}. Maybe Follow Up was not found or req.body is empty!` });
		}
	} catch (err) {
		console.error(`Error updating Follow Up with id=${id}:`, err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Delete a follow up with the specified id in the request
exports.delete = async (req, res) => {
	const id = req.params.id;

	try {
		const numDeleted = await FollowUp.destroy({
			where: { id: id }
		});

		if (numDeleted == 1) {
			res.send({ message: "Follow Up was deleted successfully!" });
		} else {
			res.status(404).send({ message: `Cannot delete Follow Up with id=${id}. Maybe Follow Up was not found!` });
		}
	} catch (err) {
		console.error(`Error deleting Follow Up with id=${id}:`, err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Delete all follow ups from the database.
exports.deleteAll = async (req, res) => {
	try {
		const numDeleted = await FollowUp.destroy({
			where: {},
			truncate: false
		});

		res.send({ message: `${numDeleted} Follow Ups were deleted successfully!` });
	} catch (err) {
		console.error("Error deleting Follow Ups:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


exports.findFollowUpsByUserVotes = async (req, res) => {
	const userId = req.params.userId;

	try {
		// Find all the video ids that the user has voted on
		const votes = await Vote.findAll({
			where: {
				user_id: userId
			},
			attributes: ["video_id"]
		});

		// Extract video_ids from the votes
		const votedVideoIds = votes.map(vote => vote.video_id);

		// Find all the follow ups corresponding to the voted video ids
		const followUps = await FollowUp.findAll({
			where: {
				video_id: {
					[Op.in]: votedVideoIds
				}
			}
		});

		if (followUps.length > 0) {
			res.json(followUps);
		} else {
			res.send(null);
		}
	} catch (error) {
		console.error("Error retrieving follow-up videos based on user votes:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
