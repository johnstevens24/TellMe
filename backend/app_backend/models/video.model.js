const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Video = sequelize.define("Video", {
    date_posted: {
      type: Sequelize.DATE
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    video_data: {
      type: Sequelize.BLOB
    },
    algo_rank: {
      type: Sequelize.BIGINT
    },
    poll_type: {
      type: Sequelize.STRING(50)
    },
    poll_question: {
      type: Sequelize.STRING(255)
    },
    end_date: {
      type: Sequelize.DATE
    },
    thumbnail: {
      type: Sequelize.STRING(255)
    },
    topic: {
      type: Sequelize.STRING(255)
    }
  });

  const Report = require('./report.model')(sequelize); // Import Report model

  Video.hasMany(Report, { foreignKey: 'video_id' }); // Define the association

  const Vote = require('./vote.model')(sequelize); // Import Vote model

  Video.hasMany(Vote, { foreignKey: 'video_id' }); // Define the association

  return Video;
};