const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // user_id: {
    //   type: Sequelize.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    date_joined: {
      type: Sequelize.DATE,
      allowNull: true // Change to false if it's required
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: true // Change to false if it's required
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: true // Change to false if it's required
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: true // Change to false if it's required
    },
    first_name: {
      type: Sequelize.STRING(50),
      allowNull: true // Change to false if it's required
    },
    last_name: {
      type: Sequelize.STRING(50),
      allowNull: true // Change to false if it's required
    },
    profile_pic: {
      type: Sequelize.BLOB,
      allowNull: false // Change to false if it's required
    }
  }, {
    tableName: 'users', // Specify the table name if it's different from the model name
    timestamps: true 
  });

  // Define any associations or methods related to the User model here

  return User;
};