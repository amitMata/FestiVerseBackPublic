const { promisify } = require("util");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const BlackListedJWT = require("../models/BlackListedJWT");
const AppError = require("../middleware/AppError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

let UserID = nanoid();

//Register to the website
exports.signup = async (req, res, next) => {
  try {
    let UserIDReg = nanoid();
    UserID = UserIDReg;

    const newUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      passwordChangedAt: req.body.passwordChangedAt,
      UserId: UserIDReg,
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
    return next(new AppError(err.message, 500));
  }
};

// Login to the website
exports.login = async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  let tokenTemp;
  if (req.cookies && req.cookies.jwt) {
    tokenTemp = req.cookies.jwt;
  } else {
    // return;
  }

  let isBlacklisted;
  try {
    isBlacklisted = await BlackListedJWT.exists({ JWT: tokenTemp });
  } catch (error) {
    console.log("Error during blacklist check:", error);
    return next(
      new AppError(
        "An error occurred during blacklist check. Please log in again.",
        500
      )
    );
  }

  if (isBlacklisted) {
    return next(
      new AppError("This session is no longer valid. Please log in again.", 401)
    );
  }

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
    userID: UserID,
  });

  const oneDayInMilliseconds = 6 * 60 * 60 * 1000; // 6 hours like the JWT expiration
  const expires = new Date(Date.now() + oneDayInMilliseconds);

  res.cookie("UserID", user.UserId, {
    httpOnly: true,
    secure: true,
    expires: expires,
  });

  res.status(200).json({
    message: "success",
    jwt: token,
  });
};

exports.protect = async (req, res, next) => {
  // getting the token and check if it exists
  let token;
  // Check if token is in cookies or Authorization header
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
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

  const isBlacklisted = await BlackListedJWT.exists({ JWT: token });
  if (isBlacklisted) {
    return next(
      new AppError("This session is no longer valid. Please log in again.", 401)
    );
  }

  // we will grant access to the protected route if we got here after all the checks
  req.user = freshUser;

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
  });

  next();
};

exports.getUserData = async (req, res, next) => {
  try {
    const userId = req.cookies.UserID;

    // Check if userId exists
    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "No UserId in cookies",
      });
    }

    const user = await User.findOne({ UserId: userId });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.validate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        status: "failure",
        message: "No token provided",
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: "failure",
          message: "Failed to authenticate token",
        });
      }

      // If everything is good, save to request for use in other routes
      req.decoded = decoded;
    });

    res.status(200).json({
      status: "success",
      message: "JWT valid",
    });
  } catch (err) {
    return res.status(500).json({
      status: "failure",
      message: "An error occurred while validating the token",
    });
  }
};
