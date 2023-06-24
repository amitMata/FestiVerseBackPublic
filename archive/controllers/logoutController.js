exports.logout = async (req, res, next) => {
  res.clearCookie("jwt");
  console.log("test 1");
  res.cookie("jwt", "nothing.", {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    message: "success",
  });
  console.log("test 2");
};
