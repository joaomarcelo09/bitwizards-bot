import { Client } from 'pg'
const PROCESS = require("dotenv").config();

export default class JGORM {
    private static client: Client

    static async connect() {
        if (!this.client) {
            this.client = new Client({
                connectionString: PROCESS.parsed.DATABASE_URL
            });
            await this.client.connect();
            console.log('connected db')
        }

        return this.client;
    }

    static async query(query: string, params?: any[]) {
        const client = await this.connect();
        try {
            return await client.query(query, params);
        } catch (error) {
            console.log('Query failed', error);
            throw error
        }
    }

    static close() {
        this.client?.end();
    }
}