const DB = require("../../helpers/storage/postgres");
const validator = require("validator");
const { MediaMutation } = require("../media/data");
const { CategoryIntegration } = require("../categories/data");
class ProductInit {
  constructor(newProduct) {
    const {
      variants = [],
      categories = [],
      status,
      publishing_state = false,
      description,
      slug,
      thumb,
      name,
    } = newProduct;

    this.productValues = [
      name,
      status,
      publishing_state,
      description,
      slug,
      thumb,
    ];
    this.variants = variants;
    this.categories = categories;
  }
  async PROCESS() {
    await this.Init();

    if (this.error) throw new Error(this.errorMessage);
    return this.product;
  }
  async Init() {
    this.client = await DB.connect();
    try {
      await this.client.query("BEGIN");

      await this._createProduct();
      await this._appendVariant();

      await this._appendCategories();

      await this.client.query("COMMIT");
    } catch (e) {
      await this.client.query("ROLLBACK");
      this.error = true;
      this.errorMessage = e.message;
    } finally {
      await this.client.release();
    }
  }
  async _createProduct() {
    this.createProduct = `INSERT INTO ${process.env.PG_PRODUCT_TABLE}(
            name, status, publishing_state, description, slug, thumb, date_created, last_updated)
            VALUES ($1, $2 ,$3, $4, $5, $6, now(),now()) returning *;`;

    const { rowCount, rows } = await this.client.query(
      this.createProduct,
      this.productValues
    );

    if (rowCount < 1) throw new Error("Cannot create Product!");

    this.product = rows[0];
  }
  async _appendCategories() {
    const categoryProcessor = new CategoryIntegration(this.client);

    this.product.categories = await categoryProcessor.appendCategories({
      product_id: this.product.id,
      categories: this.categories,
    });
  }

  async _appendVariant() {
    const variantProccess = new ProductVariantManagement(this.client);
    const result = await variantProccess.addManyVariant({
      product_id: this.product.id,
      variants: this.variants,
    });
    this.product.variants = result;
  }
}

class ProductQuery {
  constructor() {}
  async getProduct({ id = -1, slug = "" }) {
    this.query = `
            SELECT * FROM ${process.env.PG_PRODUCT_TABLE}
            WHERE id=$1 or slug=$2
            LIMIT 1;
        `;
    this.values = [id, slug];
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
        `;
    const values = [id];

    const { rows } = await DB.query(text, values);

    return rows;
  }
  async getAllVariants({ id }) {
    const text = `
        SELECT * 
        FROM ${process.env.PG_PRODUCTS_VARIANTS_TABLE} pv
        where pv.product_id=$1;
        `;
    const values = [id];

    const { rows } = await DB.query(text, values);

    return rows;
  }
  async getAllVariantImages({ id }) {
    const text = `
        select * from ${process.env.PG_TABLE_VARIANT_IMAGES} vu
        join ${process.env.PG_UPLOAD_TABLE} up
        on vu.upload_id=up.id
        where vu.variant_id=$1;
        `;
    const values = [id];

    const { rows } = await DB.query(text, values);

    return rows;
  }
  async filterProducts({
    name = "",
    page = 1,
    count = 5,
    status = "con_hang",
    lowerBoundPrice = 0,
    upperBoundPrice = 9999999999,
    isAsc = true,
    category = -3,
  }) {
    // name, status
    try {
      this.query = `
      SELECT vrnts.*,
      CASE
          WHEN vrnts.is_discount THEN vrnts.discount_price
          ELSE vrnts.base_price
      END AS sort_price
FROM public."Product_Variants" vrnts
JOIN public."Product" prd ON prd.id=vrnts.product_id

${
  category >= 0
    ? `left join public."Products_Categories" pr_cate on pr_cate.product_id=prd.id`
    : ""
}



WHERE (prd.name like $1
      OR vrnts.name like $1)
 AND (prd.status=$2)
 AND (((vrnts.is_discount=TRUE
        AND vrnts.discount_price >= $3)
       AND (vrnts.is_discount=TRUE
            AND vrnts.discount_price <= $4))
      OR ((vrnts.is_discount=FALSE
           AND vrnts.base_price >= $3)
          AND (vrnts.is_discount=FALSE
               AND vrnts.base_price <= $4)))
               ${category >= 0 ? "AND pr_cate.category_id=$7" : ""}
ORDER BY sort_price ${isAsc ? "ASC" : "DESC"}
LIMIT $5
OFFSET $6;
    `;

      this.values = [
        `%${name.trim()}%`,
        status,

        lowerBoundPrice,
        upperBoundPrice,
        count,
        count * Math.max(0, page - 1),
        category,
      ];
      if (category < 0)
        this.values = this.values.slice(0, this.values.length - 1);

      const { rows } = await DB.query(this.query, this.values);

      return rows;
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể tìm kiếm sản phẩm!");
    }
  }
  async suggestSlug(slug = "") {
    console.log(slug);
    try {
      const text = `
      SELECT count(*) from ${process.env.PG_PRODUCT_TABLE}
      where slug=$1;
      `;
      const { rows } = await DB.query(text, [slug]);
      console.log(rows);
      return parseInt(rows[0].count) === 0;
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể kiểm tra slug!");
    }
  }
  async getTotalFilterProduct({
    name = "",
    page = 1,
    count = 5,
    status = "con_hang",
    lowerBoundPrice = 0,
    upperBoundPrice = 9999999999,
    category = -3,
  }) {
    this.query = `
      SELECT count(*)

FROM public."Product_Variants" vrnts
JOIN public."Product" prd ON prd.id=vrnts.product_id

${
  category >= 0
    ? `left join public."Products_Categories" pr_cate on pr_cate.product_id=prd.id`
    : ""
}



WHERE (prd.name like $1
      OR vrnts.name like $1)
 AND (prd.status=$2)
 AND (((vrnts.is_discount=TRUE
        AND vrnts.discount_price >= $3)
       AND (vrnts.is_discount=TRUE
            AND vrnts.discount_price <= $4))
      OR ((vrnts.is_discount=FALSE
           AND vrnts.base_price >= $3)
          AND (vrnts.is_discount=FALSE
               AND vrnts.base_price <= $4)))
               ${category >= 0 ? "AND pr_cate.category_id=$7" : ""}

LIMIT $5
OFFSET $6;
    `;

    this.values = [
      `%${name.trim()}%`,
      status,

      lowerBoundPrice,
      upperBoundPrice,
      count,
      count * Math.max(0, page - 1),
      category,
    ];
    if (category < 0)
      this.values = this.values.slice(0, this.values.length - 1);

    const { rows = [] } = await DB.query(this.query, this.values);

    return Math.ceil(parseInt(rows[0].count) / count);
  }
  catch(e) {
    console.log(e.message);
    throw new Error("không thể tìm kiếm sản phẩm!");
  }
}
class ProductMutation {
  constructor(update) {
    const {
      id,
      variants = [],
      categories = [],
      status,
      description,
      slug,
      thumb,
      name,
    } = update;

    this.newVariants = variants;
    this.newCategories = categories;
    this.updateProductValue = [name, status, description, slug, thumb, id];
  }

  async UPDATE() {
    this.client = await DB.connect();
    try {
      await this.client.query("BEGIN");
      await this.updateInformation();
      await this.updateCategories();
      await this.updateVariants();
      await this.client.query("COMMIT");

      return this.product;
    } catch (e) {
      await this.client.query("ROLLBACK");

      throw new Error("Cannot update product! ");
    } finally {
      await this.client.release();
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
    const { rowCount, rows } = await this.client.query(
      texts,
      this.updateProductValue
    );
    if (rowCount < 1) throw new Error("Cannot update product information");
    this.product = rows[0];
    return;
  }
  async updateCategories() {
    const categoryProcessor = new CategoryIntegration(this.client);

    await categoryProcessor.deleteCategory({ product_id: this.product.id });
    const result = await categoryProcessor.appendCategories({
      product_id: this.product.id,
      categories: this.newCategories,
    });
    this.product.categories = result;
  }
  async updateVariants() {
    const variantProcces = new ProductVariantManagement(this.client);
    await variantProcces.deleteOldVariant({ product_id: this.product.id });
    const result = await variantProcces.addManyVariant({
      product_id: this.product.id,
      variants: this.newVariants,
    });
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
        `;
    const values = [product_id];
    await this.client.query(text, values);
  }
  async createOneVariant(index) {
    const targetID = this.targetID;

    const query = `INSERT INTO ${process.env.PG_PRODUCTS_VARIANTS_TABLE}
        ( name, quantity, base_price, is_discount, discount_price, is_stock, product_id,publishing_state)
        values($1,$2,$3,$4,$5,$6,$7,true) returning *;`;
    const {
      name,
      quantity,
      base_price,
      is_discount,
      discount_price,
      is_stock,
      images = [],
    } = this.variants[index];
    const values = [
      name,
      quantity,
      base_price,
      is_discount,
      discount_price,
      is_stock,
      targetID,
    ];

    const { rows } = await this.client.query(query, values);

    const variant = rows[0];

    const imageProcessor = new MediaMutation(this.client);

    const appenedImages = await imageProcessor.appendMediaVariant({
      variant_id: variant.id,
      images,
    });
    return { ...variant, images: appenedImages };
  }
  async addManyVariant({ product_id, variants = [] }) {
    this.targetID = product_id;
    this.variants = variants;
    const results = await Promise.all(
      this.variants.map((_, index) => this.createOneVariant(index))
    );
    return results;
  }
}
class ProductHelper {
  async deleteOneProduct({ id }) {
    try {
      const text = `
      DELETE FROM ${process.env.PG_PRODUCT_TABLE}
      where id=$1;
      `;
      await DB.query(text, [id]);
      return true;
    } catch (e) {
      console.log(e.message);
      throw new Error("can't delete!");
    }
  }
}
module.exports = { ProductMutation, ProductQuery, ProductInit ,ProductHelper};
