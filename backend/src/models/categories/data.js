const DB = require('../../helpers/storage/postgres')
const validator = require('validator')
class CategoryManament {
    constructor() {    
    }
    async getAllChild({depth,parent_id}) {
        if(!validator.isNumeric(depth+'')) throw new Error("invalid depth")

        this.depth=depth;
        this.parent_id=parent_id;

        const childs = await this._queryGetAllChild()

        return childs
    }
    getParent({child_id}) {

    }
    createChild(newChild){

    }
    editChild(updatedChild){

    }
    deleteChild(childId){
        
    }
    async _queryGetAllChild() {

        const query = `SELECT * from ${process.env.PG_CATEGORY_TABLE} where depth=$1 and parent_id=$2; `
        const values = [this.depth,this.parent_id]
        
        const response = await DB.query(query, values)
       
        return response.rows
    }

}


module.exports={CategoryManament}