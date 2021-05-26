const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
  function (accessToken, refreshToken, googleProfile, cb) {

    User.findOne({ googleId: googleProfile.id })
      .then((user) => {
        if (user) {
          if (user.avatar) {
            return user;
          }
          user.avatar = googleProfile.photos[0].value;
          return user.save()
        }

        const newUser = new User({
          name: googleProfile.displayName,
          email: googleProfile.emails[0].value,
          googleId: googleProfile.id,
          avatar: googleProfile.photos[0].value,
        });

        return newUser.save();
      })
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
)
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});


passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});