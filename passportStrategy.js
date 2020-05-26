const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userModel = require("./userModel");
const dotenv = require("dotenv");
dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const strategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await userModel.getUserByUsername(payload.username);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        console.log(error);
    }
});

module.exports = {
    strategy
};
