const DB =require('../../helpers/storage/postgres')


class MediaQuery{
    constructor(){

    }
    async getSingleMedia({id}){
        const texts=`
        SELECT * FROM ${process.env.PG_UPLOAD_TABLE}
        where id=$1
        limit 1;
        `
        const {rows,rowCount}= await DB.query(texts,[id]);
        if(rowCount>0){
            return {found:true,data:rows[0]}
        }
        return {found:false}
        
    }
}
class MediaMutation{
    constructor(instance){
        this.client=instance;
    }
    async appendMediaVariant({variant_id,images}){
        const result=await Promise.all(images.map((upload_id,index)=>this._createOneImages({variant_id,upload_id,index})))
        
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
module.exports={MediaQuery,MediaMutation}