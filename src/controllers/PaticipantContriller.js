const Participant = require("../models/Participant");
const { createRegisterService } = require("../services/authService");

module.exports = {
  postCreateRegister: async (req, res) => {
    try {
      const result = await createRegisterService(req.body, res);
      const { EC } = result;

      if (EC === -2) {
        return res.status(400).json({
          DT: "",
          EC: result.EC,
          EM: result.EM,
        });
      }
      return res.status(200).json({
        DT: "",
        EC: result.EC,
        EM: result.EM,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
