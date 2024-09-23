import { Bot } from "./bot";
import { Client, GatewayIntentBits } from "discord.js";
import JGORM from "./jgorm/database/connection";
import { env } from "./config/env";
import http from "http";

JGORM.connect();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PORT = env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running\n");
  })
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

export const bot = new Bot(client);

process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  JGORM.close();
  process.exit(0);
});
