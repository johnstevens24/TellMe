const db = require("../models");
const Option = db.options;
const Op = db.Sequelize.Op;

// Create and Save a new video
exports.create = async (req, res) => {
	try {
		// Assuming req.body contains the necessary data, adjust accordingly
		const { option, video_id } = req.body;

		// Create a new video entry
		const newOption = await Option.create({
			option: option,
			video_id: video_id
		});

		res.status(201).json(newOption);
	} catch (error) {
		console.error("Error creating Option:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Retrieve all videos from the database.
exports.findAll = async (req, res) => {
	try {
		const options = await Option.findAll();
		res.json(options);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
  
};

exports.findOne = (req, res) => {
	const id = req.params.id;

	Option.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.send(null);
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Option with id=" + id
			});
		});
};

exports.findByVidId = (req, res) => {
	const vid_id = req.params.id;
  
	Option.findAll({
		where: {
			video_id: vid_id,
		},
	})
		.then(data => {
			if (data.length > 0) {
				res.send(data);
			} else {
				res.send(null);
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Options with video_id=" + vid_id
			});
		});
};

exports.upvote = async (req, res) => {
	try {
		const id = req.params.id;
		const option = await Option.findByPk(id);
		if (option) {
			option.likes += 1;
			await option.save();
			res.json(option);
		} else {
			res.status(404).json({ message: `Cannot find option with id=${id}.` });
		}
	} catch (error) {
		console.error("Error upvoting option:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.undoUpvote = async (req, res) => {
	try {
		const id = req.params.id;
		const option = await Option.findByPk(id);
		if (option) {
			option.likes -= 1;
			await option.save();
			res.json(option);
		} else {
			res.status(404).json({ message: `Cannot find option with id=${id}.` });
		}
	} catch (error) {
		console.error("Error upvoting option:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
  
// Downvote an option
exports.downvote = async (req, res) => {
	try {
		const id = req.params.id;
		const option = await Option.findByPk(id);
		if (option) {
			option.dislikes += 1;
			await option.save();
			res.json(option);
		} else {
			res.status(404).json({ message: `Cannot find option with id=${id}.` });
		}
	} catch (error) {
		console.error("Error downvoting option:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


exports.undoDownvote = async (req, res) => {
	try {
		const id = req.params.id;
		const option = await Option.findByPk(id);
		if (option) {
			option.dislikes -= 1;
			await option.save();
			res.json(option);
		} else {
			res.status(404).json({ message: `Cannot find option with id=${id}.` });
		}
	} catch (error) {
		console.error("Error downvoting option:", error);
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