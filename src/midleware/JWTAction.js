var jwt = require("jsonwebtoken");
require("dotenv").config();

const nonSecurePaths = ["/", "/register", "/login", "/logout"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  let expiresIn = process.env.JWT_EXPIRES;
  // ko dung callback

  try {
    token = jwt.sign(payload, key, { expiresIn });
  } catch (error) {
    console.log(error);
  }

  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  // check phia fe, khi goi len 3 route nay se khong check quyen va cho next
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);
  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded) {
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Not authenticated the user ",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user ",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  extractToken,
};
