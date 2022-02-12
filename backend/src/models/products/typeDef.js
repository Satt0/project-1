const { gql } = require("apollo-server");

module.exports = gql`
  type Product {
    id: Int!
    name: String!
    status: String!
    publishing_state: Boolean!
    description: String!
    date_created: String!
    last_updated: String!
    slug: String!
    thumb: Media!
    variants: [Variant]
    categories: [Category!]
  }
  type Variant {
    id: Int!
    name: String!
    base_price: Int!
    quantity: Int!
    is_discount: Boolean!
    discount_price: Int!
    publishing_state: Boolean!
    is_stock: Boolean!
    images: [Media]!
    origin: Product!
  }
  type Media {
    id: Int!
    url: String!
    type: String!
    date_created: String!
    last_udpated: String!
  }
  type ProductFilter {
    products: [Variant!]!
    totalPage: Int!
    currentPage: Int!
  }
  input inputProductCreate {
    name: String!
    status: String!
    description: String!
    slug: String!
    thumb: Int!
    categories: [Int]!
    variants: [inputVariant]!
  }
  input inputVariant {
    name: String!
    base_price: Int!
    quantity: Int!
    is_discount: Boolean!
    discount_price: Int!
    is_stock: Boolean!
    images: [Int]!
  }
  input getProductInput {
    id: Int!
    slug: String
  }
  input inputFilterProduct {
    page: Int!
    count: Int!
    name: String!
    status: String!
    lowerBoundPrice: Int!
    upperBoundPrice: Int!
    category: Int!
    isAsc: Boolean!
  }
  input inputUpdateProduct {
    id: Int!
    name: String!
    status: String!
    description: String!
    slug: String!
    thumb: Int!
    categories: [Int]!
    variants: [inputVariant]!
  }
  extend type Mutation {
    createProduct(input: inputProductCreate!): Product!
    updateProduct(input: inputUpdateProduct!): Product!
    deleteOneProduct(input: Int!): Boolean!
  }
  extend type Query {
    getProduct(input: getProductInput!): Product!
    filterProduct(input: inputFilterProduct!): ProductFilter!
    checkProductSlug(input: String!): Boolean!
  }
`;
