const { ProductInit, ProductQuery ,ProductMutation} = require('./data')

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
}
const Variant={
    images:async ({id}, _, __, ___) => {
        const w=new ProductQuery()
        const result=await w.getAllVariantImages({id});
        return result;
    },
}
const Query = {
    getProduct: async (_, { input }, __, ___) => {
        const worker = new ProductQuery()
        const result = await worker.getProduct(input)
        return result;
    }

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
    }
}
module.exports = {
    root:{Product,Variant}, Query, Mutation
}