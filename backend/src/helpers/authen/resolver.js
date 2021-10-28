const {UserAuthentication}=require("./user")
const {AuthenticationError} = require('apollo-server')
const authenticate=(resolverRole,next)=>async (parent, args, context, infor)=>{
       try{
        const jwt=context?.authorization?.substring('Bearer '.length) || null
        const user=new UserAuthentication(jwt)

        if(user.authenUserRole() >= resolverRole){
            return await next(parent,args,context,infor);
        }
        
        throw new AuthenticationError("USER NOT AUTHENTICATED!")
       }catch(e){
        throw e
       }
}


module.exports={authenticate}