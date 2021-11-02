const { TokenValidation } = require('./token')
const { errorFormater } = require('../format/error')
const { UserInputError } = require('apollo-server')
const validator = require('validator')

class UserAuthentication {
    constructor(jwt) {
        if (typeof jwt !== 'string')
            throw new UserInputError("no jwt found!");


        const validator = new TokenValidation();

        const user = validator.validateJWT(jwt.substring('Bearer '.length));

        if (typeof user !== 'object')
            throw new UserInputError("jwt is corupted or missing!");
        this.user=user;
        return;

    }
    authenUserIdentity() {

        const { id } = this.user;
        if (!validator.isNumeric(id + ''))
            throw new UserInputError("there is no user!");

        return id;

    }
    authenUserRole() {

        const { role } = this.user;

        if (!validator.isNumeric(role + ''))
            throw new UserInputError("there is no user!");

        return role;

    }

}







module.exports = { UserAuthentication }