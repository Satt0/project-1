const { ProductInit, ProductQuery ,ProductMutation,ProductHelper} = require('./data')
const {MediaQuery}=require('../media/data')
const Product = {
    categories: async ({id}, _, __, ___) => {
        const w=new ProductQuery()
        const result=await w.getCategories({id});
        return result;
    },
    variants: async ({id}, _, __, ___) => {
        const w=new ProductQuery()
        const result=await w.getAllVariants({id});
        return result;
    },
    thumb:async ({thumb}, _, __, ___) => {
        const w=new MediaQuery()
        const {data}=await w.getSingleMedia({id:thumb});
        return data
    },
}
const Variant={
    images:async ({id}, _, __, ___) => {
        const w=new ProductQuery()
        const result=await w.getAllVariantImages({id});
        return result;
    },
    origin:async ({product_id}, _, __, ___) => {
        const w=new ProductQuery()
        const result=await w.getProduct({id:product_id});
        return result;
    },
}
const ProductFilter={
    totalPage:async ({input})=>{
        console.log(input);
        const w=new ProductQuery()
        const result=await w.getTotalFilterProduct(input);
        
        return result;
    }
}
const Query = {
    getProduct: async (_, { input }, __, ___) => {
        const worker = new ProductQuery()

        
        const result = await worker.getProduct(input)
        
        return result;
    },
    filterProduct:async(_,{input})=>{
        const w=new ProductQuery()
        const result=await w.filterProducts(input);
        
        return {products:result,currentPage:input.page,input};
    },
    checkProductSlug:async(_,{input})=>{
        const w=new ProductQuery()
        const result=await w.suggestSlug(input);
        return result
    },

}
const Mutation = {
    createProduct: async (_, { input }, __, ___) => {

        const worker = new ProductInit(input);
        const result = await worker.PROCESS()
        return result
    },
    updateProduct:async (_, { input }, __, ___) => {

        const worker = new ProductMutation(input);
        const result = await worker.UPDATE()
        return result
    },
    deleteOneProduct:async (_,{input})=>{
        const db=new ProductHelper()
        return await db.deleteOneProduct({id:input})
    }
}
module.exports = {
    root:{Product,Variant,ProductFilter}, Query, Mutation
}