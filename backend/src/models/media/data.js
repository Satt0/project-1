const DB = require("../../helpers/storage/postgres");
const fs = require("fs");

class MediaQuery {
  constructor() {}
  async getSingleMedia({ id }) {
    const texts = `
        SELECT * FROM ${process.env.PG_UPLOAD_TABLE}
        where id=$1
        order by id desc
        limit 1;
        `;
    const { rows, rowCount } = await DB.query(texts, [id]);
    if (rowCount > 0) {
      return { found: true, data: rows[0] };
    }
    throw new Error("NOT FOUND!");
  }
  async getManyMedia({ limit = 20, offset = 0 }) {
    const texts = `
        SELECT * FROM ${process.env.PG_UPLOAD_TABLE}
        order by id desc
        limit $1
        offset $2;
        `;
    const values = [limit, offset];
    const { rows } = await DB.query(texts, values);
    return rows;
  }
}
class MediaMutation {
  constructor(instance) {
    this.client = instance;
  }
  async appendMediaVariant({ variant_id, images }) {
    const result = await Promise.all(
      images.map((upload_id, index) =>
        this._createOneImages({ variant_id, upload_id, index })
      )
    );

    return result;
  }
  async deleteOneMedia({ id }) {
    try {
      const text = `
            DELETE FROM ${process.env.PG_UPLOAD_TABLE} 
            WHERE id=$1
            RETURNING *; 
            
            `;
      await DB.query(text, [id]);

      return true;
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể xóa!");
    }
  }

  async _createOneImages({ variant_id, upload_id, index }) {
    const texts = `
        INSERT INTO ${process.env.PG_TABLE_VARIANT_IMAGES}(
            variant_id, upload_id, "order")
            VALUES ($1, $2, $3);
            `;
    const values = [variant_id, upload_id, index];

    const { rowCount, rows } = await this.client.query(texts, values);
    if (rowCount < 1) throw new Error("cannot insert Image");
    return rows[0];
  }
}
class UploadMedia {
  constructor(images) {
    this.images = images;
  }

  async uploadMany() {
    this.client = await DB.connect();
    try {
      await this.client.query("BEGIN");

      const results = await Promise.all(
        this.images.map((img) => this.insertOneImage(img))
      );

      await this.client.query("COMMIT");
      return results;
    } catch (e) {
      await this.client.query("ROLLBACK");
    } finally {
      await this.client.release();
    }
  }
  async insertOneImage({ path, mimetype }) {
    const text = `
        INSERT INTO ${process.env.PG_UPLOAD_TABLE}(
             url, type, date_created, last_updated)
            VALUES ($1, $2, now(),now())
            RETURNING *;
        `;
    const values = [path, mimetype];
    const { rowCount, rows } = await this.client
      .query(text, values)
      .catch((e) => {
        throw new Error("Cannot insert");
      });
    if (rowCount < 1) throw new Error("CANNOT Upload images");
    return rows[0];
  }
}
module.exports = { MediaQuery, MediaMutation, UploadMedia };
