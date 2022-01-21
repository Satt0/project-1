const DB = require("../../helpers/storage/postgres");
const validator = require("validator");
class CategoryManament {
  constructor() {}
  // handlers
  async getAllChild({ depth, parent_id }) {
    if (!validator.isNumeric(depth + "")) throw new Error("invalid depth");

    this.depth = depth;
    this.parent_id = parent_id;

    const childs = await this._queryGetAllChild();

    return childs;
  }
  async getParent({ parent_id }) {
    this.parent_id = parent_id;
    return await this._queryGetParent();
  }
  async createChild(newChild) {
    this.newChild = newChild;
    return await this._queryCreateOneChild();
  }
  async editChild(updatedChild) {
    const { id, name, slug } = updatedChild;

    const query = `
        UPDATE ${process.env.PG_CATEGORY_TABLE}
	    SET name=$1, slug=$2
	    WHERE id=$3 returning *;
        `;
    const parameters = [name, slug, id];

    const response = await DB.query(query, parameters);

    if (response.rowCount < 1) throw new Error("Cannot update!");
    return response.rows[0];
  }
  async deleteChild(target_id) {
    this.target_id = target_id;
    return await this._queryDeleteChild();
  }
  // database queries
  async _queryGetAllChild() {
    if (validator.isNumeric(this.parent_id + "")) {
      const query = `SELECT * from ${process.env.PG_CATEGORY_TABLE} where depth=$1 and parent_id=$2; `;
      const values = [this.depth, this.parent_id];

      const response = await DB.query(query, values);
      return response.rows;
    } else {
      const query = `SELECT * from ${process.env.PG_CATEGORY_TABLE} where depth=$1 and parent_id is null; `;
      const values = [this.depth];

      const response = await DB.query(query, values);

      return response.rows;
    }
  }
  async _queryCreateOneChild() {
    const { name, parent_id, depth, slug } = this.newChild;

    const query = `
            INSERT INTO ${process.env.PG_CATEGORY_TABLE}(name,parent_id,depth,slug) values($1,$2,$3,$4) returning *;
        `;
    const parameters = [name, parent_id, depth, slug];

    const response = await DB.query(query, parameters);

    if (response.rowCount < 1) throw new Error("Cannot create!");
    return response.rows[0];
  }
  async _queryGetParent() {
    const query = `SELECT * FROM ${process.env.PG_CATEGORY_TABLE} where id=$1 limit 1;`;
    const param = [this.parent_id];

    const response = await DB.query(query, param);

    if (response.rowCount >= 1) return response.rows[0];

    return null;
  }
  async _queryDeleteChild() {
    try {
      const text = `DELETE from ${process.env.PG_CATEGORY_TABLE} where id=$1;`;
      const values = [this.target_id];

      await DB.query(text, values);

      return true;
    } catch (e) {
      return false;
    }
  }
}

class CategoryQuery {
  constructor(instance = false) {
    if (typeof instance === "object") {
      this.client = instance;
    }
  }
  async checkUniqueCategory(slug = "") {
    try {
      const text = `
            select count(*) from ${process.env.PG_CATEGORY_TABLE}
            where slug=$1;
            `;
      const { rows } = await DB.query(text, [slug]);
      return parseInt(rows[0].count) === 0;
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể kiểm tra slug");
    }
  }
}
class CategoryIntegration {
  constructor(instance) {
    this.client = instance;
  }
  async appendCategories({ product_id, categories }) {
    this.product_id = product_id;
    const result = await Promise.all(
      categories.map((cate) => this._createOneCategory(cate))
    );
    return result;
  }
  async _createOneCategory(cate) {
    const targetID = this.product_id;
    const texts = `
        INSERT INTO ${process.env.PG_TABLE_PRODUCTS_CATEGORIES}(
            product_id, category_id)
            VALUES ($1, $2);
        `;
    const values = [targetID, cate];
    const { rows } = await this.client.query(texts, values);

    return rows[0];
  }
  async deleteCategory({ product_id }) {
    const deleteOldCategory = `DELETE FROM ${process.env.PG_TABLE_PRODUCTS_CATEGORIES}
        WHERE product_id=$1; `;
    await this.client.query(deleteOldCategory, [product_id]);
  }
  async deleteVariantImages({ variant_id }) {}
}

module.exports = { CategoryManament, CategoryIntegration, CategoryQuery };
