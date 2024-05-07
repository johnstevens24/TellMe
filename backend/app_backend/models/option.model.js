const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Option = sequelize.define('Option', {
      option: {
        type: Sequelize.STRING(255)
      },
      video_id: {
        type: Sequelize.INTEGER
      },
      likes: {
        type: Sequelize.INTEGER
      },
      dislikes: {
        type: Sequelize.INTEGER
      }
    }, {
      tableName: 'options', // Specify the table name if it's different from the model name
      timestamps: true 
    });
  
    return Option;
  };