const {CategoryManament}=require('./data')

const root={
    parent:(child)=>{

        return {id:1,name:"test",slug:"test",depth:12}
    },
    child:(parent)=>{
        return [{id:1,name:"test",slug:"test",depth:12}]
    }
}
const Query={
    
    getCategory:async(_,{input},__,___)=>{
        const categories=new CategoryManament();
        return await categories.getAllChild(input);
       
    }
}
module.exports={
    Query,
    root

}