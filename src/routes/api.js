const express = require("express");
const {
  postCreateRegister,
  postLogin,
} = require("../controllers/PaticipantContriller");
const router = express.Router();

// auth - paticipant
router.post("/register", postCreateRegister);
router.post("/login", postLogin);

module.exports = router;
