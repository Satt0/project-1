

const root={

}
const Query={
    
}
const Mutation={
    createProduct:async(_,{input},__,___)=>{
        console.log(input);


        return "ok"
    }
}
module.exports={
    root,Query,Mutation
}