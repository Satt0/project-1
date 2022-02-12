const { CategoryManament,CategoryQuery } = require('./data')
const { authenticate } = require('../../helpers/authen/resolver')
const root = {
    parent: async (child) => {
        const { parent_id } = child;
        const query = new CategoryManament();
        const response=await query.getParent({ parent_id })
        
        if(response) return response
        return null
    },
    child: async ({ depth, id }) => {
        const categories = new CategoryManament();
        return await categories.getAllChild({ depth: parseInt(depth) + 1, parent_id: id });
    },
    count:async({id})=>{
        const query = new CategoryManament();
        const response=await query.countAll({ id })
        return response
    }

}
const Query = {

    getCategory: authenticate(-1, async (_, { input }, __, ___) => {
        const categories = new CategoryManament();
        return await categories.getAllChild(input);

    }),
    checkUniqueCategory:async (_,{input})=>{
        const categories = new CategoryQuery();
        return await categories.checkUniqueCategory(input);
    }
}
const Mutation = {
    createCategory: authenticate(1, async (_, { input }, __, ___) => {
        const categories = new CategoryManament();

        return await categories.createChild(input);

    }),
    updateCategory:authenticate(1, async (_, { input }, __, ___) => {
        const categories = new CategoryManament();

        return await categories.editChild(input);

    }),
    deleteCategory:authenticate(1, async (_, { input }, __, ___) => {
        const categories = new CategoryManament();

        return await categories.deleteChild(input);

    })
}
module.exports = {
    Query,
    root,
    Mutation

}