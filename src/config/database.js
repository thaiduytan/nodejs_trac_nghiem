require("dotenv").config();

// TEST CONNECTION //--- https://mongoosejs.com/docs/connections.html
// get the client
const mongoose = require("mongoose");

// Create the connection pool. The pool-specific settings are the defaults
// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: +process.env.DB_PORT, //default : 3306
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const connection = async () => {
  //  ===========cachs 1 hack code
  // try {
  //   await mongoose.connect("mongodb://root:123456@localhost:27018");
  // } catch (error) {
  //   // handleError(error);
  //   console.log(error);
  // }

  // ========cach 2 : options https://mongoosejs.com/docs/connections.html#options
  const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  };
  mongoose.connect(process.env.DB_HOST, options);
};

module.exports = connection;
