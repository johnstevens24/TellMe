const db = require("../models");
const Option = db.options;
const Report = db.reports;
const Sequelize = require('sequelize');

const reportThreshold = 50;

// Create and Save a new report
exports.createReport = async (req, res) => {
  try {
    const { video_id, option_id, user_id, reasoning } = req.body;

    const newReport = await Report.create({
      video_id: video_id,
      option_id: option_id,
      user_id: user_id,
      reasoning: reasoning
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating Report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve all reports from the database.
exports.findAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (err) {
    console.error('Error retrieving Reports:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Find reports by video_id
exports.findReportsByVideoId = async (req, res) => {
  try {
    const video_id = req.params.video_id;
    const reports = await Report.findAll({
      where: {
        video_id: video_id,
      },
    });
    res.json(reports);
  } catch (err) {
    console.error('Error retrieving Reports:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.findReportsByReasoning = async (req, res) => {
    try {
      const reason = req.params.reason;
      const reports = await Report.findAll({
        where: {
          reasoning: reason,
        },
      });
      res.json(reports);
    } catch (err) {
      console.error('Error retrieving Reports:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.findReportsByOptionId = async (req, res) => {
    try {
      const option_id = req.params.option_id;
      const reports = await Report.findAll({
        where: {
          option_id: option_id,
        },
      });
      res.json(reports);
    } catch (err) {
      console.error('Error retrieving Reports:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Find reports by user_id
exports.findReportsByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const reports = await Report.findAll({
      where: {
        user_id: user_id,
      },
    });
    res.json(reports);
  } catch (err) {
    console.error('Error retrieving Reports:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOptionsWithReportCountGreaterThan = async (req, res) => {
    let video_id; // Define video_id outside of the try block
    try {
        video_id = req.params.video_id;

        const options = await Option.findAll({
            attributes: ['id'],
            include: [{
                model: Report,
                where: { video_id: video_id },
                attributes: [],
                required: true,
            }],
            group: ['Option.id'], // Corrected alias
            having: Sequelize.literal(`COUNT(*) > ${reportThreshold}`)
        });

        const optionIds = options.map(option => option.id);

        res.json(optionIds);
    } catch (error) {
        console.error(`Error getting options with report count > ${reportThreshold} for video_id ${video_id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


  exports.getOptionsReportedByUserForVideo = async (req, res) => {
    try {
      const { user_id, video_id } = req.params;
  
      const options = await Option.findAll({
        attributes: ['id'],
        include: [{
          model: Report,
          where: { user_id: user_id },
          required: true // This ensures that only options with associated reports will be included
        }],
        where: { video_id: video_id } // Filter options based on video_id directly
      });
  
      const optionIds = options.map(option => option.id);
      
      res.json(optionIds);
    } catch (error) {
      console.error('Error getting options reported by user for video:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  exports.hasReportsCountGreaterThan = async (req, res) => {
    try {
      const { video_id } = req.params;
  
      const reportCount = await Report.count({
        where: { video_id: video_id, option_id: null }
      });
  
      res.json({ hasGreaterThanThreshold: reportCount > reportThreshold });
    } catch (error) {
      console.error('Error checking report count for video:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  // Find if video has already been reported by user
  exports.hasReportedVideo = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const video_id = req.params.video_id;
    const reports = await Report.findAll({
      where: {
        user_id: user_id,
        video_id: video_id,
        option_id: null
      },
    });

    // Check if any reports were found
    const hasReported = reports.length > 0;
    
    res.json( hasReported );
  } catch (err) {
    console.error('Error retrieving Reports:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
  
exports.findMostReportedReasonByOptionId = async (req, res) => {
  try {
      const option_id = req.params.option_id;

      const mostReportedReason = await Report.findAll({
          attributes: ['reasoning', [Sequelize.fn('COUNT', 'reasoning'), 'reasonCount']],
          where: {
              option_id: option_id,
          },
          group: ['reasoning'],
          order: [[Sequelize.literal('reasonCount'), 'DESC']],
          limit: 1,
      });

      res.json(mostReportedReason);
  } catch (err) {
      console.error('Error retrieving most reported reason:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

