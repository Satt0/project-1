const {MediaQuery}=require('./data')

const root={
    Media:{

    }
}
const Query={
    getManyMedia:async(_,{input},__,___)=>{
        
        const data=new MediaQuery()
        return await data.getManyMedia(input)
    },
    getOneMedia:async(_,{input},__,___)=>{

    }
}
const Mutation={

}
module.exports={
    Query,root,Mutation
}