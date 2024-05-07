const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Vote = sequelize.define('Vote', {
      user_id: {
        type: Sequelize.INTEGER
      },
      video_id: {
        type: Sequelize.INTEGER
      },
      option_id: {
        type: Sequelize.INTEGER
      },
      vote_date: {
        type: Sequelize.DATE
      }
    }, {
      tableName: 'votes', // Specify the table name if it's different from the model name
      timestamps: true 
    });

    Vote.associate = models => {
      Vote.belongsTo(models.Option, { foreignKey: 'option_id', as: 'id' });
    };

    Vote.belongsTo(sequelize.models.Video, { foreignKey: 'video_id', as: 'video' });
  
    return Vote;
  };