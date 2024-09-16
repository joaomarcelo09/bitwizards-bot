import JGORM from '../database/connection'

export class Migrations {
    static async createTables() {
        try {
            const query = `CREATE TABLE IF NOT EXISTS scheduled_messages (
                id SERIAL PRIMARY KEY,
                message TEXT NOT NULL,
                day_of_week VARCHAR(10) NOT NULL,
                time TIME NOT NULL,
                channel_id VARCHAR(255) NOT NULL
            );`
            await JGORM.query(query)

            console.log('table created')
        } catch (error) {
            console.log('Table Error', error)
        }

    }
}