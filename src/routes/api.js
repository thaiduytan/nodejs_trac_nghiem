const express = require("express");
const { postCreateRegister } = require("../controllers/PaticipantContriller");
const router = express.Router();


// auth - paticipant
router.post("/register", postCreateRegister);

module.exports = router;