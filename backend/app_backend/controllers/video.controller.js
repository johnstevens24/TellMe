const db = require("../models");
const Video = db.videos;
const Op = db.Sequelize.Op;

// Create and Save a new video
exports.create = async (req, res) => {
	try {
		// Assuming req.body contains the necessary data, adjust accordingly
		const { datePosted, userId, videoData, pollType, pollQuestion, endDate, thumbnail, topic} = req.body;
		// Create a new video entry
		const newVideo = await Video.create({
			date_posted: datePosted,
			user_id: userId,
			video_data: videoData,
			poll_type: pollType,
			poll_question: pollQuestion,
			end_date: endDate,
			thumbnail: thumbnail,
			topic: topic
		});

		res.status(201).json(newVideo);
	} catch (error) {
		console.error("Error creating video:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Retrieve all videos from the database.
exports.findAll = async (req, res) => {
	const page = parseInt(req.query.currentPage) || 1;
	const pageSize = parseInt(req.query.pageSize) || 10;
	const offset = (page - 1) * pageSize;
	const reportThreshold = 50; // Define your threshold here

	try {
		const videos = await Video.findAll({
			where: db.Sequelize.literal(
				`(SELECT COUNT(*) FROM reports WHERE reports.video_id = Video.id) < ${reportThreshold}`
			),
			limit: pageSize,
			offset: offset,
			order: [["createdAt", "DESC"]]
		});
		res.json(videos);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.findOne = (req, res) => {
	const id = req.params.id;

	Video.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.send(null); // Return null if no video is found
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Tutorial with id=" + id
			});
		});
};

exports.findByTopic = async (req, res) => {
	const topic = req.params.topic;
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 10;
	const offset = (page - 1) * pageSize;
	const reportThreshold = 50; // Define your threshold here

	try{
		const videos = await Video.findAll({
			where: {
				topic: topic,
				[db.Sequelize.Op.and]: [
					db.Sequelize.literal(
						`(SELECT COUNT(*) FROM reports WHERE reports.video_id = Video.id) < ${reportThreshold}`
					)
				]
			},

			limit: pageSize,
			offset: offset,
			order: [["createdAt", "DESC"]],
		});
	
		res.json(videos);
	}

	
	catch(err) {
		res.status(500).json({
			message: "Error retrieving videos with topic=" + topic
		});
	}
};


// Update a video by the id in the request
exports.update = (req, res) => {
  
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

// Returns all the videos of a user
exports.getUsersVideos = async (req, res) => {
	const id = req.params.id;
	Video.findAll({
		where:
      {
      	user_id : id
      }
	}).then(data => {
		if (data) {
			res.send(data);
		} else {
			res.send("This user has no videos");
		}
	})
		.catch(err => {
			res.status(500).send({
				message: "Error videos made by user id = " + id
			});
		});
};

// Delete a video with the specified id in the request
exports.delete = async (req, res) => {
	const id = req.params.id;
  
	try {
	  const deletedVideoCount = await Video.destroy({
		where: {
		  id: id
		}
	  });
  
	  if (deletedVideoCount === 1) {
		res.json({ message: "Video deleted successfully" });
	  } else {
		res.status(404).json({ message: "Video not found" });
	  }
	} catch (error) {
	  console.error("Error deleting video:", error);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
  