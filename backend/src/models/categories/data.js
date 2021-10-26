const DB = require('../../helpers/storage/postgres')
const validator = require('validator')
class CategoryManament {
    constructor() {
    }
    // handlers
    async getAllChild({ depth, parent_id }) {
        if (!validator.isNumeric(depth + '')) throw new Error("invalid depth")

        this.depth = depth;
        this.parent_id = parent_id;

        const childs = await this._queryGetAllChild()

        return childs
    }
    async getParent({ parent_id }) {
        this.parent_id = parent_id;
        return await this._queryGetParent();
    }
    async createChild(newChild) {
        this.newChild = newChild;
        return await this._queryCreateOneChild();
    }
    editChild(updatedChild) {

    }
    deleteChild(child_id) {

    }
    // database queries
    async _queryGetAllChild() {
        if (validator.isNumeric(this.parent_id + '')) {

            const query = `SELECT * from ${process.env.PG_CATEGORY_TABLE} where depth=$1 and parent_id=$2; `
            const values = [this.depth, this.parent_id]

            const response = await DB.query(query, values)
            return response.rows

        } else {


            const query = `SELECT * from ${process.env.PG_CATEGORY_TABLE} where depth=$1 and parent_id is null; `
            const values = [this.depth]


            const response = await DB.query(query, values)

            return response.rows
        }
    }
    async _queryCreateOneChild() {
        const { name, parent_id, depth, slug } = this.newChild;

        const query = `
            INSERT INTO ${process.env.PG_CATEGORY_TABLE}(name,parent_id,depth,slug) values($1,$2,$3,$4) returning *;
        `
        const parameters = [name, parent_id, depth, slug]

        const response = await DB.query(query, parameters)

        if (response.rowCount < 1)
            throw new Error("Cannot create!")
        return response.rows[0]


    }
    async _queryGetParent() {
        const query = `SELECT * FROM ${process.env.PG_CATEGORY_TABLE} where id=$1 limit 1;`
        const param = [this.parent_id]

        const response = await DB.query(query, param)

        if (response.rowCount >= 1) return response.rows[0]

        return {}
    }

}


module.exports = { CategoryManament }