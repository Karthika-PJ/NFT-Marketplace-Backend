'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const loggerUtil = require('../utilities/logger');

exports.serializeUser = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
};

exports.deserializeUser = () => {
  passport.deserializeUser(async (id, done) => {
    try {
      /** Get the user data from db and pass it in the done function below */
      return done(null, {});
    } catch (ex) {
      loggerUtil.error({
        message: ex.toString(),
        level: 'error'
      });
      return done(ex, false);
    }
  });
};

exports.configureStrategy = () => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      /** Get the user data from db,
       *  write the password check logic
       *  and pass it in the done function below */
      return done(null, {});
    } catch (ex) {
      loggerUtil.error({
        message: ex.toString(),
        level: 'error'
      });
      return done(ex, false);
    }
  }));
};
