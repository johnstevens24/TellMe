const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const FollowUp = sequelize.define("FollowUp", {
    date_posted: {
      type: Sequelize.DATE
    },
    video_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Video', // Name of the referenced table
        key: 'id'       // Column name in the referenced table
      }
    },
    followup_data: {
      type: Sequelize.BLOB
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'User', // Name of the referenced table
        key: 'id'      // Column name in the referenced table
      }
    },
    thumbnail: {
      type: Sequelize.STRING(255)
    },
    chosen_id: {
      type: Sequelize.INTEGER
    },
  }, {
    tableName: 'followups', 
    timestamps: true 
  });

  return FollowUp;
};

