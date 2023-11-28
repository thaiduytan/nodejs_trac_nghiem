const express = require("express");
const {
  postCreateRegister,
  postLogin,
  postLogout,
} = require("../controllers/AuthController");
const {
  postCreateParticipant,
  putParticipant,
  deleteParticipant,
  getParticipant,
  updateProfile,
  changePassword,
  getHistory,
} = require("../controllers/ParticipantController");
const { checkUserJWT } = require("../midleware/JWTAction");
const {
  getAllQuizByParticipant,
  getQuestionByIdQuiz,
  postQuizSubmit,
} = require("../controllers/QuizDoingController");
const {
  createANewQuiz,
  getAllQuizForAdmin,
  putQuizAdmin,
  deleteQuizAdmin,
  createANewQuestion,
  createANewAnswer,
  getQuizWithQA,
  postUpsertQA,
  assignQuizToUser,
  getAllParticipant,
  dashBoardOverviewForAdmin,
  getHistoryForAdmin,
} = require("../controllers/QuizAdminController");
const router = express.Router();

// const checkUser= (req, res, next) => {
//   // check phia fe, khi goi len 3 route nay se khong check quyen
//   const nonSecurePaths = ["/", "/register", "/login"];
//   if (nonSecurePaths.includes(req.path)) return next();

//   //authenticate user
//   next();
// };

router.all("*", checkUserJWT);

// auth - paticipant
router.post("/register", postCreateRegister);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.post("/profile", updateProfile)
router.post("/change-password",changePassword)

// admin - manage Users
router.get("/participant", getParticipant);
router.post("/participant", postCreateParticipant);
router.put("/participant", putParticipant);
router.delete("/participant", deleteParticipant);

// user - quiz doing
router.get("/quiz-by-participant", getAllQuizByParticipant);
router.get("/questions-by-quiz", getQuestionByIdQuiz);
router.post("/quiz-submit", postQuizSubmit);
router.get("/history",getHistory)
router.get("/overview",dashBoardOverviewForAdmin)

// ADMIN - quiz
router.post("/quiz", createANewQuiz);
router.get("/quiz/:by", getAllQuizForAdmin);
router.put("/quiz", putQuizAdmin);
router.delete("/quiz/:id", deleteQuizAdmin);
router.get("/quiz-with-qa/:id", getQuizWithQA);
router.post("/quiz-upsert-qa",postUpsertQA)
router.post("/quiz-assign-to-user",assignQuizToUser)
router.get("/participant/all",getAllParticipant)
router.get("/history-with-admin",getHistoryForAdmin)
// ADMIN - question
router.post("/question", createANewQuestion);
// ADMIN - answers
router.post("/answer", createANewAnswer);

module.exports = router;
