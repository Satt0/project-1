const { CategoryManament } = require('./data')
const { authenticate } = require('../../helpers/authen/resolver')
const root = {
    parent: async (child) => {
        const { parent_id } = child;
        const query = new CategoryManament();
        return await query.getParent({ parent_id })

    },
    child: async ({ depth, id }) => {
        const categories = new CategoryManament();
        return await categories.getAllChild({ depth: parseInt(depth) + 1, parent_id: id });
    }
}
const Query = {

    getCategory: authenticate(0, async (_, { input }, __, ___) => {
        const categories = new CategoryManament();
        return await categories.getAllChild(input);

    })
}
const Mutation = {
    createCategory: authenticate(0, async (_, { input }, __, ___) => {
        const categories = new CategoryManament();

        return await categories.createChild(input);

    })
}
module.exports = {
    Query,
    root,
    Mutation

}