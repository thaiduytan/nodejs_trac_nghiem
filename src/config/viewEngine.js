const path = require("path");
const express = require("express");

const configViewEngine = (app) => {
  //  __dirname : thuộc tính cho biết đường dẫn hiện tại ||   app.set("views", path.join(__dirname, "views")); (\src\config\views : sai)
  // cofige template engine with ejs
  app.set("views engine", "ejs");
  app.set("views", path.join("./src", "views"));
  
  // cofige static file public images/css/js
  app.use(express.static(path.join("./src", "public")));
};
module.exports = configViewEngine;
