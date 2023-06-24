const { promisify } = require("util");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../middleware/AppError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Register to the website
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    return next(new AppError("This user already exists."), 401);
  }
};

// Login to the website
exports.login = async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  //check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password"), 400);
  }

  //check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"), 401);
  }

  // if everything is ok, send token to client as a cookie
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    message: "success",
    token,
  });
};

exports.protect = async (req, res, next) => {
  // getting the token and check if it exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access"),
      401
    );
  }

  // validate the token (verification)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("The user does not exist."), 401);
  }

  // check if user changed password after the token (JWT) was issued. If changedPasswordAfter returns true, it means that the use changed password after the token was created, and therefore the token is not valid.
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again.", 401)
    );
  }

  // If we got here, we will grant access to the protected route.
  req.user = freshUser;

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
  });

  next();
};
