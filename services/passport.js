const passport = require("passport");
const User = require("../models/user");
const config = require("../config/config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const localLogin = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false);
      }
      try {
        const isMatch = await user.comparePasswords(password);
        if (!isMatch) {
          return done(null, false);
        }

        return done(null, user);
      } catch (e) {
        throw new Error();
      }
    } catch (e) {
      return done(e);
    }
  }
);

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

const JwtLogin = new JwtStrategy(JwtOptions, async (payload, done) => {
  const existingUser = await User.findById(payload.sub);

  if (existingUser) {
    return done(null, existingUser);
  } else {
    return done(null, false);
  }
});

passport.use(JwtLogin);
passport.use(localLogin);
