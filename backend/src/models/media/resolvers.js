
const root={
    Media:{

    }
}
const Query={
    getManyMedia:async(_,{input},__,___)=>{
        return [{id:1,url:'123',type:"img",date_created:Date.now()}]
    },
    getOneMedia:async(_,{input},__,___)=>{

    }
}
const Mutation={

}
module.exports={
    Query,root,Mutation
}