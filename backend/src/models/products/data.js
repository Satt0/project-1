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

        if (rowCount < 1) throw new Error("cannot insert Image")
        return rows[0]

    }
}

class ProductQuery {
    constructor() {

    }
    async getProduct({ id }) {



        this.query = `
            SELECT * FROM ${process.env.PG_PRODUCT_TABLE}
            WHERE id=$1
            LIMIT 1;
        `
        this.values = [id]
        const { rows } = await DB.query(this.query, this.values);
        console.log(rows, id);
        return rows[0];

    }
    async getCategories({ id }) {
        const text = `
        select id,name,slug,parent_id,depth from ${process.env.PG_P_C_TABLE} pc
        join ${process.env.PG_CATEGORY_TABLE} cate
        on pc.category_id=cate.id
        where pc.product_id=$1
        ;
        `
        const values = [id]

        const { rows } = await DB.query(text, values)

        return rows
    }
    async getAllVariants({ id }) {
        const text = `
        SELECT * 
        FROM ${process.env.PG_PRODUCTS_VARIANTS_TABLE} pv
        where pv.product_id=$1;
        `
        const values = [id]

        const { rows } = await DB.query(text, values)

        return rows
    }
    async getAllVariantImages({ id }) {
        const text = `
        select * from ${process.env.PG_TABLE_VARIANT_IMAGES} vu
        join ${process.env.PG_UPLOAD_TABLE} up
        on vu.upload_id=up.id
        where vu.variant_id=$1;
        `
        const values = [id]

        const { rows } = await DB.query(text, values)

        return rows
    }
}
class ProductMutation {
    constructor(update) {
        const {variants,name,slug}=update;
        this.updatedProduct=update
     }

    async UPDATE() {
        const client = await DB.connect()
        try {
            await client.query("BEGIN")




            await client.query("COMMIT")
            return this.updatedProduct;
        } catch (e) {
            await client.query("ROLLBACK")
            
        } finally {
            await client.release()
        }
    }

    async updateCategories() {

    }
    async updateVariantsImages() {

    }
    async updateOneVariants() {

    }
}


module.exports = { ProductMutation, ProductQuery, ProductInit }

