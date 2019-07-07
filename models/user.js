const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Email is Invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password cannot be password");
      }
    }
  }
});

userSchema.methods.comparePasswords = async function(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    return error;
  }
};

userSchema.pre("save", async function(next) {
  const user = this;
  const salt = await bcrypt.genSalt(10);

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, salt, null);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
