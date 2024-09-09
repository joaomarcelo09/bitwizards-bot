import { Bot } from "./bot";
import { Client, GatewayIntentBits } from "discord.js"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


export const bot = new Bot(client)




