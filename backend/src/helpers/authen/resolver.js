const { UserAuthentication } = require("./user");
const { AuthenticationError } = require("apollo-server");
const authenticate =
  (resolverRole, next) => async (parent, args, context, infor) => {
    console.log(resolverRole);
    try {
      if (resolverRole >= 0) {
        const jwt = context.authorization;
        const user = new UserAuthentication(jwt);
        if (user.authenUserRole() < resolverRole) throw new AuthenticationError("User not authorized!");
      }
      return await next(parent, args, context, infor);
    } catch (e) {
      throw e;
    }
  };

module.exports = { authenticate };
