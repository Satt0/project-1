//PG_ORDER_TABLE=public."User_Order"
//PG_O_P_TABLE=public."Order_Product"
const DB = require("../../helpers/storage/postgres");

class OrderManagement {
  constructor(newOrder) {
    try {
      const { user, items = [] } = newOrder;
      if (items.length <= 0) throw new Error();
      this.basic = [user, items.map((e) => e.price).reduce((a, c) => a + c)];
      this.orderItems = items;
    } catch (e) {
      console.log(e.message);
      throw new Error("kiểm tra lại đầu vào!");
    }
  }
  async create() {
    this.client = await DB.connect();
    try {
      await this.client.query("BEGIN");

      await this._insertBasic();
      await Promise.all(this.orderItems.map((it) => this._insertOrderItem(it)));
      await this.client.query("COMMIT");
      return this.result;
    } catch (e) {
      console.log(e.message);
      await this.client.query("ROLLBACK");
    } finally {
      await this.client.release();
    }
  }
  async _insertBasic() {
    try {
      const text = `
            INSERT INTO ${process.env.PG_ORDER_TABLE}(
                user_id,  total_price, status,date_created)
                VALUES ($1,$2,'cho_duyet',now())
                RETURNING *;
            `;
      const { rows, rowsCount } = await this.client.query(text, this.basic);
      if (rowsCount < 0) throw new Error();
      this.result = rows[0];
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể tạo sản phẩm!");
    }
  }

  async _insertOrderItem({ quantity, product_id, price }) {
    try {
      const { id } = this.result;
      const text = `
      INSERT INTO ${process.env.PG_O_P_TABLE}(
    order_id, product_id, quantity, price)
        VALUES ($1,$2,$3,$4)
             RETURNING *; `;
      const { rowsCount } = await this.client.query(text, [
        id,
        product_id,
        quantity,
        price,
      ]);
      if (rowsCount < 0) throw new Error();
      return;
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể tạo sản phẩm!");
    }
  }
}
class OrderQuery {
  async getOrderList({
    status = "cho_duyet",
    limit = 10,
    offset = 0,
    user_id = -1,
  }) {
    try {
      const text = `
        SELECT * FROM ${process.env.PG_ORDER_TABLE} ord
        where status=$1 ${user_id >= 0 ? "and user_id=$4" : ""}
        order by date_created desc
        limit $2
        offset $3;
        `;
        let values=[status, limit, offset, user_id];
        if(user_id<=0) values.pop()
        console.log(values);
      const { rows } = await DB.query(text, values);
      return rows;
    } catch (e) {}
  }
  async getOrderItems({ order_id }) {
    try {
      const text = `
        SELECT * FROM ${process.env.PG_O_P_TABLE} ord
        where order_id=$1;
        `;
      const { rows } = await DB.query(text, [order_id]);
      return rows;
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
  }
  async getVariant({ product_id }) {
    try {
      const text = `
        SELECT * FROM ${process.env.PG_PRODUCTS_VARIANTS_TABLE} 
        WHERE id=$1
        LIMIT 1;
        `;
      const { rows, rowsCount } = await DB.query(text, [product_id]);
     
      if (rowsCount <= 0) throw new Error();
      return rows[0];
    } catch (e) {
      throw new Error("not found");
    }
  }
}

class OrderUpdate {
  constructor(update) {
    const { status, id } = update;
    this.update = [status, id];
  }
  async updateOrder() {
    try {
      const text = `
            UPDATE ${process.env.PG_ORDER_TABLE}
	SET status=$1
	WHERE id=$2
    RETURNING *;
            `;
      const { rows, rowCount } = await DB.query(text, this.update);
      if (rowCount <= 0) throw new Error();
      return rows[0];
    } catch (e) {
      console.log(e.message);
      throw new Error("không thể udpate!");
    }
  }
}
module.exports = { OrderManagement, OrderQuery, OrderUpdate };
