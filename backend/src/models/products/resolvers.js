const {ProductInit,ProductManagement}=require('./data')

const root={

}
const Query={
    getProduct:async(_,{input},__,___)=>{
       const worker=new ProductManagement()


      

        return  await worker.getProduct(input)
    }
    
}
const Mutation={
    createProduct:async(_,{input},__,___)=>{
       
        const worker=new ProductInit(input);
        const result=await worker.PROCESS()
        // console.log(result);

        return result
    }
}
module.exports={
    root,Query,Mutation
}