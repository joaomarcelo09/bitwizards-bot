import { Bot } from "./bot";
import { Client, GatewayIntentBits } from "discord.js"
import JGORM from './jgorm/database/connection'
import { SchedulerService } from "./jgorm/services/schedule-service";
import { Migrations } from "./jgorm/models/migration";

JGORM.connect()
Migrations.createTables()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export const bot = new Bot(client)

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  JGORM.close();
  process.exit(0);
});



