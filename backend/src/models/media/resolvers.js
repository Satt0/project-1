const { MediaQuery, MediaMutation } = require("./data");

const root = {
  Media: {},
};
const Query = {
  getManyMedia: async (_, { input }, __, ___) => {
    const data = new MediaQuery();
    return await data.getManyMedia(input);
  },
  // getOneMedia:async(_,{input},__,___)=>{

  // }
};
const Mutation = {
  deleteOneMedia: async (_, { input }) => {
    const data = new MediaMutation();
    return await data.deleteOneMedia({ id: input });
  },
};
module.exports = {
  Query,
  root,
  Mutation,
};
