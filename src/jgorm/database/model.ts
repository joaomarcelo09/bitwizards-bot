import JGORM from "./connection";
import QueryBuilder from "./querybuilder";

export class Model {
    static tableName: string;

    static async create(data: Object) {
        try {
            const query = QueryBuilder.buildInsert(this.tableName, data);
            const result = await JGORM.query(query);
            return result.rows[0];

        } catch (error) {
            console.log('Create Error', error)
        }
    }
}