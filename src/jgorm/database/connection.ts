import { Client } from 'pg'
import { Migrations } from '../models/migration';

export default class JGORM {
    private static client: Client

    static async connect() {
        if (!this.client) {
            this.client = new Client({
                user: 'tododb_owner',
                host: 'ep-wild-truth-a5ncxzy2.us-east-2.aws.neon.tech',
                database: 'bitbotdb',
                password: 'oydwhK9V1nFX',
                port: 5432,
                ssl: {
                    rejectUnauthorized: false
                }
            });
            await this.client.connect();
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