export default class QueryBuilder {
    static buildInsert(tableName: string, data: Object) {
        const fields = Object.keys(data).join(', ');
        const values = Object.values(data).map((val) => `'${val}'`).join(', ');
        return `INSERT INTO ${tableName} (${fields}) VALUES (${values}) RETURNING *;`
    }
}