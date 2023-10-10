const express = require("express");
const configViewEngine = require("./config/viewEngine");
const fileUpload = require("express-fileupload");

const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const { MongoClient } = require("mongodb");
const { mongoose } = require("mongoose");
const Participant = require("./models/Participant");
const Quizz = require("./models/Quiz");
const ParticipantQuiz = require("./models/ParticipantQuiz");
// const connection = require("./config/database");
// cài thư viện env imporrt và confire ( npm install --save-exact dotenv@16.0.3 )
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Add headers before the routes are defined
app.use(function (req, res, next) {
  //https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// cofige express-fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/src/",
  })
);

// cofige get data passed from a form in Express (Node.js)
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

// cofige template engine with ejs // cofige static file public
configViewEngine(app);

// khai bao routes CSR
// app.use("/", webRoutes);
// khai bao routes SSR
app.use("/v1/api/", apiRoutes);
// app.use("/api/v1/",apiRoutes)

// const ngov = new User({ name: "ngov" });
// ngov.save();

//  CONNECTION //--- https://mongoosejs.com/docs/connections.html
// tạo thứ tự kết nối trước, rồi mới chạy app.listen
(async () => {
  try {
    // using mongoose
    await connection();
    mongoose.connection.on("connected", () => {
      console.log("Kết nối đến MongoDB đã thành công");

      app.listen(port, hostname, () => {
        console.log(`Example app listening on port ${port}`);
      });
    });
  } catch (error) {
    console.log("Error connect to DB:", error);
  }
})();

// connection();
// mongoose.connection.on("connected", () => {
//   console.log("Kết nối đến MongoDB đã thành công");
// });
// app.listen(port, hostname, () => {
//   console.log(`Example app listening on port ${port}`);
// });
