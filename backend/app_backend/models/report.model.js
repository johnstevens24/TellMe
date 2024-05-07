const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Report = sequelize.define('Report', {
      video_id: {
        type: Sequelize.INTEGER
      },
      option_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      reasoning: {
        type: Sequelize.STRING(255)
      }
    }, {
      tableName: 'reports', // Specify the table name if it's different from the model name
      timestamps: true 
    });
  
    return Report;
  };