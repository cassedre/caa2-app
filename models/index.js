const mongoose = require("mongoose");
require('dotenv').config();

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url =process.env.MONGODBURL; 
db.Items = require("./model.js")(mongoose);

module.exports = db;