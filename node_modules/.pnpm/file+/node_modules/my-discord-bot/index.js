const {
  Client,
  GatewayIntentBits,
  ThreadAutoArchiveDuration,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const PROCESS = require("dotenv").config();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  console.log("passou aqui", message);
  const userId = message.author.id;
  if (
    message.content === "Oi, eu sou a Julia" &&
    userId === "680117530487947339"
  ) {
    try {
      await message.channel.send(
        `Ola julinha, voce sabia que seu namorado te ama muito e ele te acha a garota mais
          incrível e linda do mundo ? ele te ama mais do que a quantidade de estrelas no céu
          eu gostaria de uma botzinha que gostasse de mim assim ;), <@${userId}>.`
      );
    } catch (error) {
      console.error("Error creating thread:", error);
      await message.channel.send("There was an error creating the thread.");
    }
  }

  if (
    message.content === "Eu quero criar um projeto" &&
    message.channelId === "1281857314587934751"
  ) {
    const roleId = "1282059717027299439";

    try {
      const thread = await message.channel.threads.create({
        name: `Novo projeto do ${message.author.username}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
        type: 11,
        reason: "Thread created for user interaction",
      });

      await thread.send(
        `Olá, <@${userId}>! <@&${roleId}> entrará em contato logo por meio dessa thread.`
      );
      await message.channel.send(
        `Uma thread foi criada para você expor suas ideias, <@${userId}>.`
      );
    } catch (error) {
      console.error("Error creating thread:", error);
      await message.channel.send("There was an error creating the thread.");
    }
  }
});

client.login(PROCESS.parsed.DISCORD_TOKEN);
