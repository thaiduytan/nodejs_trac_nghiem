require("dotenv").config(); // cài thư viện env imporrt và confire ( npm install --save-exact dotenv@16.0.3 )
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const fileUpload = require("express-fileupload");

const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const { MongoClient } = require("mongodb");
const { mongoose } = require("mongoose");
const { createJWT, verifyToken } = require("./midleware/JWTAction");
var cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
// const QuizQuestion = require("./models/QuizQuestion");
// const QuizAnswer = require("./models/QuizAnswer");

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// Parse Cookie header
app.use(cookieParser());

// Sử dụng body-parser middleware để xử lý dữ liệu từ yêu cầu.
// Giới hạn kích thước của yêu cầu là 10MB trong ví dụ này. Bạn có thể điều chỉnh giới hạn theo nhu cầu của bạn.
app.use(bodyParser.json({ limit: '10mb' }));

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
    "X-Requested-With,content-type, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // fix loi cors  khi gui bearer tokeen tu fe
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

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

// app.use("/api/v1/",apiRoutes)
app.use("/v1/api/", apiRoutes);
app.use((req, res) => {
  return res.send("404 not found");
});

//  CONNECTION //--- https://mongoosejs.com/docs/connections.html
// tạo thứ tự kết nối trước, rồi mới chạy app.listen
(async () => {
  try {
    // using mongoose
    await connection();
    mongoose.connection.on("connected", () => {
      console.log("Kết nối đến MongoDB đã thành công");
      app.listen(port, hostname, async () => {
        // const res = await QuizAnswer({
        //   description: "cauD toi la ai",
        //   correct_answer: "true",
        //   question_id: "6530f0b80499502409865cb5",
        // });
        // res.save();
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
