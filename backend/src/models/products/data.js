const DB = require('../../helpers/storage/postgres');
const validator = require("validator")
const { UserInputError } = require('apollo-server-core')
class ProductInit {
    constructor(newProduct) {

        const { variants = [], categories = [], status, publishing_state = false, description, slug, thumb, name } = newProduct;

        this.productValues = [name, status, publishing_state, description, slug, thumb]
        this.variants = variants
        this.categories = categories

    }
    async PROCESS() {
        await this.Init();

        if (this.error)
            throw new Error(this.errorMessage)
        return this.product
    }
    async Init() {
        this.client = await DB.connect()
        try {
            await this.client.query("BEGIN")

            await this._createProduct()
            await this._appendVariant()
            await this._appendCategories()
            await this.client.query("COMMIT")

        } catch (e) {
            await this.client.query("ROLLBACK")
            this.error = true
            this.errorMessage = e.message
        } finally {
            await this.client.release()
        }




    }
    async _createProduct() {

        this.createProduct = `INSERT INTO ${process.env.PG_PRODUCT_TABLE}(
            name, status, publishing_state, description, slug, thumb, date_created, last_updated)
            VALUES ($1, $2 ,$3, $4, $5, $6, now(),now()) returning *;`

        const { rowCount, rows } = await this.client.query(this.createProduct, this.productValues)

        if (rowCount < 1) throw new Error("Cannot create Product!");

        this.product = rows[0]


    }
    async _appendCategories() {
        const result = await Promise.all(this.categories.map((cate) => this._createOneCategory(cate)))

        this.product.categories = result
    }
    async _createOneCategory(cate) {
        const targetID = this.product.id
        const texts = `
        INSERT INTO ${process.env.PG_TABLE_PRODUCTS_CATEGORIES}(
            product_id, category_id)
            VALUES ($1, $2);
        `
        const values = [targetID, cate];
        const { rows } = await this.client.query(texts, values);
        console.log(rows);
        return rows[0]
    }
    async _appendVariant() {
        const results = await Promise.all(this.variants.map((_, i) => this._createOneVariant(i)));
        this.product.variants = results

    }
    async _createOneVariant(index) {
        const targetID = this.product.id;
        const query = `INSERT INTO ${process.env.PG_PRODUCTS_VARIANTS_TABLE}
        ( name, quantity, base_price, is_discount, discount_price, is_stock, product_id,publishing_state)
        values($1,$2,$3,$4,$5,$6,$7,true) returning *;`
        const { name, quantity, base_price, is_discount, discount_price, is_stock, images = [] } = this.variants[index]
        const values = [name, quantity, base_price, is_discount, discount_price, is_stock, targetID]

        const { rows } = await this.client.query(query, values)


        const variant = rows[0]
        const appenedImages = await this._appendImages({ variant_id: variant.id, images })
        return { ...variant, images: appenedImages }


    }
    async _appendImages({ variant_id, images }) {

        const result = await Promise.all(images.map((upload_id, index) => this._createOneImages({ variant_id, upload_id, index })))
        return result;
    }
    async _createOneImages({ variant_id, upload_id, index }) {
        const texts = `
        INSERT INTO ${process.env.PG_TABLE_VARIANT_IMAGES}(
            variant_id, upload_id, "order")
            VALUES ($1, $2, $3);
            `
        const values = [variant_id, upload_id, index];
        const { rowCount, rows } = await this.client.query(texts, values)
        console.log(variant_id, upload_id, index, rows);
        if (rowCount < 1) throw new Error("cannot insert Image")
        return rows[0]

    }
}

class ProductManagement {
    constructor() {

    }
    async getProduct({ id, slug,limit=1 }) {
        console.log(validator.isEmpty(id+''),slug,limit);
        if (validator.isEmpty(id + '') && validator.isEmpty(slug + '')) throw new UserInputError("both id and slug are empty")

        this.query = `
            SELECT * FROM ${process.env.PG_PRODUCT_TABLE}
            WHERE ${validator.isEmpty(id + '') ? "id=$1" : "id is not null "} and ${validator.isEmpty(slug + '') ? "slug=$2" : "slug is not null"}
            LIMIT ${Math.max(limit,20)};
        `
        this.values = [id, slug].filter(e => !validator.isEmpty(e + ''))
        const { rows } = await DB.query(this.query, this.values);
        return rows;

    }
}


module.exports = { ProductInit, ProductManagement }

