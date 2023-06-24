const BlackListedJWT = require("../models/BlackListedJWT");

exports.logout = async (req, res, next) => {
  try {
    const { jwt } = req.cookies;
    const BlackListedTemp = await BlackListedJWT.create({ JWT: jwt });

    res.clearCookie("jwt");
    res.clearCookie("UserID");

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(400).json({
      message: "error logging out",
    });
  }
};
