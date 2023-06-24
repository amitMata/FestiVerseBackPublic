const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserScheme = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please insert email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please insert password"],
    select: false,
  },
  passwordChangedAt: Date,
});

UserScheme.pre("save", async function (next) {
  //Only run if password was modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserScheme.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserScheme.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  //False means that the password was not changed
  return false;
};

const UserModel = mongoose.model("User", UserScheme);

module.exports = UserModel;
