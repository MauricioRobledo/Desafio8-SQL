const knex = require("knex");


class ContenedorMysql{
    constructor(options, tableName){
    this.database = knex(options);
    this.tableName = tableName;
    }
    async getAll(){
        try {
            const data = await this.database.from(this.tableName).select("*");
            const results = data.map(elm=>({...elm}));
            return results;
        } catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async save(newData){
        try {
            const [id] = await this.database.from(this.tableName).insert(newData);
            return `new element saved with id: ${id}`;
        } catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async getById(id){
        try {
            const data = await this.database.from(this.tableName).where("id",id);
            return data;
        } catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async deleteById(id){
        try{
            await this.database.from(this.tableName).where("id",id).del()
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }
    async updateById(id, body){
        try{
            console.log(body)
            await this.database.from(this.tableName).where("id",id).update({"title": body.title, "price": body.price, "thumbnail": body.thumbnail})
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }
}

module.exports = ContenedorMysql;