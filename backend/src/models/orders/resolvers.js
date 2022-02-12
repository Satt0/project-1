const { OrderManagement, OrderQuery,OrderUpdate } = require("./data");
const {UserQuery} = require('../users/data')
const root = {
  Order: {
    items: async ({ id }) => {
      const data = new OrderQuery();
      return await data.getOrderItems({ order_id: id });
    },
    user:async({user_id})=>{
        const data=new UserQuery()
        return await data.getUserInformation({user_id})
    }
  },
  OrderItem: {
    variant: async ({ product_id }) => {
      const data = new OrderQuery();
      return await data.getVariant({ product_id });
    },
  },
};
const Query = {
  getOrder: async (_, { input }) => {
    const data = new OrderQuery();
    return await data.getOrderList(input);
  },
};
const Mutation = {
  createOrder: async (_, { input }) => {
    const worker = new OrderManagement(input);
    return await worker.create();
  },
  updateOrder: async (_, { input }) => {``
    const worker = new OrderUpdate(input);
   
    return await worker.updateOrder();
  },
};
module.exports = {
  root,
  Query,
  Mutation,
};
