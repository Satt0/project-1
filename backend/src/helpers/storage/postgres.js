const {Client,Pool}=require('pg')
const options={
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
}
const client = new Pool(options)

module.exports=client