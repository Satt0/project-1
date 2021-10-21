const { UserLogin, UserSignup } = require('./data')
const { TokenValidation } = require('../../helpers/authen/token')
const User={

}
const Query = {
    signIn: async (_, { input }, __, ___) => {
        const validator = new UserLogin(input)
        const response = await validator.login()
        if (response.error === true)
            throw new Error(response.message)
        // user ok
        const encoder = new TokenValidation()
        const token = encoder.signJWT(response)
        return { ...response, token }
    },

}
const Mutation = {
    signUp: async (_, { input }, __, ___) => {
        const registration = new UserSignup(input)
        const user = await registration.signup()
        
        if (user.error === true)
            throw new Error(user.message)
        // user ok.
        const encoder = new TokenValidation()
        const token = encoder.signJWT(user)
        return { ...user, token }

    }
}
module.exports = { Query, Mutation }