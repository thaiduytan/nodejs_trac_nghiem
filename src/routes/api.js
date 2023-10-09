const express = require("express");
const router = express.Router();


// auth - paticipant
router.post("/paticipant", postCreatePaticipant);