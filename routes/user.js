// const express = require("mongoose");
// const User = require("../models/user");
const auth = require("../controllers/auth");
const passportService = require("../services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = app => {
  app.post("/signup", auth.signup);

  app.get("/", requireAuth, (req, res) => {
    res.send({ Data: "Hello" });
  });

  app.post("/signin", requireSignin, auth.signin);
};
