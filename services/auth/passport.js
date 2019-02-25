//TODO: comment

const passport = require('passport');
const userRouter = require('../../routes/users');

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(targetUsername, done) {
	let user = userRouter.find(selection => selection.username === targetUsername);
	user ? done(null, user) : done(user, 'oops');
}

module.exports = passport;
