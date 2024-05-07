require("dotenv").config();

module.exports = {
	HOST: process.env.DB_HOST,
	USER: process.env.DB_USER,
	PASSWORD: process.env.DB_PASSWORD,
	DB: process.env.DB,
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
};

/*
    max: maximum number of connection in pool
    min: minimum number of connection in pool
    idle: maximum time, in milliseconds, that a connection can be idle before being released
    acquire: maximum time, in milliseconds, that pool will try to get connection before throwing error
  */