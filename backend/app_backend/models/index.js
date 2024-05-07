const dbConfig = require("../config/db_config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.videos = require("./video.model.js")(sequelize, Sequelize); 
db.users = require("./user.model.js")(sequelize, Sequelize); 
db.options = require("./option.model.js")(sequelize, Sequelize); 
db.votes = require("./vote.model.js")(sequelize, Sequelize); 
db.followups = require("./followup.model.js")(sequelize, Sequelize); 
db.reports = require("./report.model.js")(sequelize, Sequelize); 

db.options.hasMany(db.reports, { foreignKey: 'option_id' }); // Assuming reports table has an 'option_id' column
db.reports.belongsTo(db.options, { foreignKey: 'option_id' });

module.exports = db;