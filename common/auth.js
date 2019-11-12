const passport = require("passport");
const passportJWT = require("passport-jwt");
const { User } = require("../models/user");
const config = require("./jwt_config");

const {ExtractJwt, Strategy} = passportJWT
const options = {
    secretOrKey = config.jwtSecret,
    jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('jwt')
};

module.exports = () => {
    const strategy = new Strategy(options,async(payload,done)=>{
        const user = await User.findById(payload.id)
        if(user){
            return done(null,{id: user_id, email: user_email, name: user_name});
        }else{
            return done( new Error('user not founr=d'), null);
        }
    });
    passport.use(strategy);
    return{
        initiallze(){
            return passport.initialize();
        },
        authentice(){
            return passpprt.authentice('jwt',config.jwtSession);
        }
    };
};