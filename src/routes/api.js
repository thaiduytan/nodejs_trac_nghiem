const express = require("express");
const {
  postCreateRegister,
  postLogin,
} = require("../controllers/AuthController");
const {
  getAllParticipant,
  postCreateParticipant,
  putParticipant,
  deleteParticipant,
} = require("../controllers/ParticipantController");
const router = express.Router();

// auth - paticipant
router.post("/register", postCreateRegister);
router.post("/login", postLogin);

// admin - manage Users
router.get("/participant", getAllParticipant);
router.post("/participant", postCreateParticipant);
router.put("/participant", putParticipant);
router.delete("/participant", deleteParticipant);

module.exports = router;
