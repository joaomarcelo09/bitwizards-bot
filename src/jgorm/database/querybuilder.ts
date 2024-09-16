export default class QueryBuilder {
    static buildInsert(tableName: string, data: Object) {
        const fields = Object.keys(data).join(', ');
        const values = Object.values(data).map((val) => `'${val}'`).join(', ');
        return `INSERT INTO ${tableName} (${fields}) VALUES (${values}) RETURNING *;`
    }

    static buildFindAll(tableName: string, filters?: Record<string, any>) {
        let query = `SELECT * FROM ${tableName}`;
        if (filters && Object.keys(filters).length > 0) {
            const conditions = Object.keys(filters)
                .map(key => `${key} = '${filters[key]}'`)
                .join(' AND ');
            query += ` WHERE ${conditions}`;
        }
        return query + ';';
    }

}