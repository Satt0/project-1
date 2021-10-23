const {UserAuthentication}=require("./user")

const authenticate=(resolverRole,next)=>async (parent, args, context, infor)=>{
       try{
        const jwt=context.authorization.substring('Bearer '.length)
        const user=new UserAuthentication(jwt)

        if(user.authenUserRole() >= resolverRole){
            return await next(parent,args,context,infor);
        }
        
        throw new Error("USER NOT AUTHORIZED!")
       }catch(e){
        throw new Error(e.message)
       }
}


module.exports={authenticate}