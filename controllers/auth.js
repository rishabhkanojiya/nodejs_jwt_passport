const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config/config");

const tokenFunction = user => {
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
};

exports.signin = (req, res) => {
  res.send({ token: tokenFunction(req.user) });
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });

  try {
    const result = await User.findOne({ email });
    if (result) {
      return res.status(422).send({ error: "Email already exist" });
    }
    await user.save();

    res.send({ user, token: tokenFunction(user) });
  } catch (error) {
    res.status(404).send(error);
  }
};
