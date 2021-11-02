const DB = require('../../helpers/storage/postgres');


class ProductManament {
    constructor() { }
    async createProduct(newProduct) {

        const {variants=[], base_price, status, publishing_state = false, description, promotion, slug, thumb } = newProduct;
        this.texts = `INSERT INTO ${process.env.PG_PRODUCT_TABLE}(
            base_price, status, publishing_state, description, date_created, last_updated, promotion, slug, thumb)
            VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8, $9) returning *;`
        this.values = [base_price, status, publishing_state, description, promotion, slug, thumb]
        
        this.variants=variants.map(e=>({
            values:{}
        }))

        return await this._queryCreateProduct()
    }
    // db
    async _queryCreateProduct() {

        const client=await DB.connect();
        try {
            await client.query('BEGIN')
            const { rowCount, rows } = await DB.query(this.texts, this.values);
            if(rowCount<1) throw new Error('Cannot create product')

            const product=rows[0]

            const variants=await Promise.all(this.variants.map(async e=>{
                const variantQuery=`INSERT INTO ${process.env.PG_PRODUCTS_VARIANTS_TABLE}
                (name, base_price, is_discount, discount_price, is_stock,quantity,status, publishing_state)
                    values() returning *;
                `
                const variantValues=[]
                return await client.query(variantQuery,variantValues)
            }))

            
            await client.query('COMMIT')
            return {...product,variant:variants.map(e=>e.rows[0])}

        } catch (e) {
            await client.query('ROLLBACK')
        } finally {
           await client.release()
        }

    }
}


module.exports = { ProductManament }

