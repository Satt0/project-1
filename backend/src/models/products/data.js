const DB = require('../../helpers/storage/postgres');

class ProductInit {
    constructor(newProduct) {

        const { variants = [], base_price, status, publishing_state = false, description, promotion, slug, thumb } = newProduct;

        this.productValues = [base_price, status, publishing_state, description, promotion, slug, thumb]
        this.variants = variants
    }
    async PROCESS() {
        await Init();
        if (this.error)
            throw new Error("Cannot create!")
        return this.product
    }
    async Init() {
        this.client = await DB.connect()
        try {
            await this.client.query("BEGIN")

            await this.createProduct()
            await this._appendVariant()

            await this.client.query("COMMIT")

        } catch (e) {
            await this.client.query("ROLLBACK")
            this.error = true
        } finally {
            await this.client.release()
        }




    }
    async _createProduct() {

        this.createProduct = `INSERT INTO ${process.env.PG_PRODUCT_TABLE}(
            base_price, status, publishing_state, description, date_created, last_updated, promotion, slug, thumb)
            VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8, $9) returning *;`

        const { rowCount, rows } = await this.client.query(this.createProduct, this.productValues)

        if (rowCount < 1) throw new Error("Cannot create Product!");

        this.product = rows[0]


    }
    async _appendVariant() {
        const results = await Promise.all(this.variants.map((_, i) => this._createOneVariant(i)));
        this.product.variants = results.map(e => e.rows[0]);

    }
    async _createOneVariant(index) {
        const targetID = this.product.id;
        const query = `INSERT INTO ${process.env.PG_PRODUCTS_VARIANTS_TABLE}
        (name, base_price, is_discount, discount_price, is_stock,quantity,status, publishing_state)
            values() returning *;`
        const { name, quantity, base_price } = this.variants[index]
        const values = [name, base_price, quantity]
        const { rowCount, rows } = await this.client.query(query, values)
        if (rowCount > 0) return rows[0]

        throw new Error()
    }
}



module.exports = { ProductManament }

