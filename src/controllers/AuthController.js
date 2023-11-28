const {
  createRegisterService,
  loginService,
} = require("../services/authService");

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
  postLogin: async (req, res) => {
    try {
      const result = await loginService(req.body, res);
      // set cookie
      res.cookie("jwt", result.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  postLogout: (req, res) => {
    try {
      res.clearCookie("jwt");

      return res.status(200).json({
        EM: "ok",
        EC: 0,
        DT: "",
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  }
};
