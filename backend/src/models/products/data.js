const DB = require('../../helpers/storage/postgres');
const validator = require("validator")
const { MediaMutation } = require('../media/data')
const { CategoryIntegration } = require('../categories/data');
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

        const categoryProcessor = new CategoryIntegration(this.client);

        this.product.categories = await categoryProcessor.appendCategories({ product_id: this.product.id, categories: this.categories })
    }

    async _appendVariant() {
        const variantProccess = new ProductVariantManagement(this.client);
        const result = await variantProccess.addManyVariant({ product_id: this.product.id, variants: this.variants })
        this.product.variants = result

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
        const { id, variants = [], categories = [], status, description, slug, thumb, name } = update;

        this.newVariants = variants;
        this.newCategories = categories;
        this.updateProductValue = [name, status, description, slug, thumb, id]
    }

    async UPDATE() {
        this.client = await DB.connect()
        try {
            await this.client.query("BEGIN")
            await this.updateInformation();
            await this.updateCategories();
            await this.updateVariants()
            await this.client.query("COMMIT")
        
            return this.product;
        } catch (e) {
            await this.client.query("ROLLBACK")
            
            throw new Error("Cannot update product! ")
        } finally {
            await this.client.release()
        }
    }
    async updateInformation() {
        const texts = `
        UPDATE ${process.env.PG_PRODUCT_TABLE}
        SET
        name=$1, status=$2, description=$3, last_updated=now(), slug=$4, thumb=$5
        WHERE id=$6 
        returning *;
        `;
        const { rowCount, rows } = await this.client.query(texts, this.updateProductValue)
        if (rowCount < 1) throw new Error("Cannot update product information");
        this.product = rows[0]
        return;
    }
    async updateCategories() {
        const categoryProcessor = new CategoryIntegration(this.client);



        await categoryProcessor.deleteCategory({ product_id: this.product.id })
        const result = await categoryProcessor.appendCategories({ product_id: this.product.id, categories: this.newCategories })
        this.product.categories = result;
    }
    async updateVariants() {
        const variantProcces = new ProductVariantManagement(this.client);
        await variantProcces.deleteOldVariant({ product_id: this.product.id })
        const result = await variantProcces.addManyVariant({ product_id: this.product.id, variants: this.newVariants })
        this.product.variants = result;
    }


}

class ProductVariantManagement {
    constructor(instance) {
        this.client = instance;
    }
    async deleteOldVariant({ product_id }) {
        const text = `
        DELETE FROM ${process.env.PG_PRODUCTS_VARIANTS_TABLE} pv
	    WHERE pv.product_id=$1;
        `
        const values = [product_id]
        await this.client.query(text, values);
    }
    async createOneVariant(index) {
        const targetID = this.targetID;

        const query = `INSERT INTO ${process.env.PG_PRODUCTS_VARIANTS_TABLE}
        ( name, quantity, base_price, is_discount, discount_price, is_stock, product_id,publishing_state)
        values($1,$2,$3,$4,$5,$6,$7,true) returning *;`
        const { name, quantity, base_price, is_discount, discount_price, is_stock, images = [] } = this.variants[index]
        const values = [name, quantity, base_price, is_discount, discount_price, is_stock, targetID]

        const { rows } = await this.client.query(query, values)


        const variant = rows[0]
        
        const imageProcessor = new MediaMutation(this.client);
        
        const appenedImages = await imageProcessor.appendMediaVariant({ variant_id:variant.id, images })
        return { ...variant, images: appenedImages }

    }
    async addManyVariant({ product_id, variants = [] }) {
        
        this.targetID = product_id;
        this.variants = variants;
        const results = await Promise.all(this.variants.map((_, index) => this.createOneVariant(index)));
        return results
    }
}

module.exports = { ProductMutation, ProductQuery, ProductInit }

