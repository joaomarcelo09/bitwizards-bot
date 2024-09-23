import {
  Client,
  CommandInteraction,
  Interaction,
  REST,
  Routes,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";
import * as commandModules from "./commands";
import { env } from "./config/env";
import { SchedulerService } from "./jgorm/services/schedule-service";
import JGORM from "./jgorm/database/connection";

var cron = require("node-cron");

export class Bot {
  public commands = Object(commandModules);
  constructor(public readonly client: Client) {
    client.login(env.DISCORD_TOKEN);

    client.once("ready", (bot) => {
      console.log(`Logged in as ${bot.user.tag} in port ${env.PORT}`);
    });

    this.client.once("shardError", (error) => {
      console.error(`[bot]: something bad happened, ${error.message}`);
    });

    this.registerCommands();
    this.onMessageInteract();
    this.onInteractionCreate();
    this.registerCron();
  }

  private async registerCron() {
    cron.schedule("0 9 * * *", async () => {
      await JGORM.refreshConnection();

      await SchedulerService.sendScheduleMessages(this.client);
    });
    cron.schedule("0 * * * *", async () => {
      await JGORM.refreshConnection();
      // this.onXuliaInteract(this.client);
      console.log("refresh connection");
    });
  }

  private async registerCommands() {
    const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
    const commands: any = [];
    for (const module of Object.values<{ data: unknown }>(commandModules)) {
      commands.push(module.data);
    }
    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
        body: commands,
      });
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Error registering commands:", error);
    }
  }

  private async onInteractionCreate() {
    this.client.on("interactionCreate", async (interaction) => {
      if (interaction.isCommand()) {
        const { commandName } = interaction;
        this.commands[commandName].execute(interaction, this.client);
      }

      if (interaction.isAutocomplete()) {
        const { commandName } = interaction;
        this.commands[commandName].autocomplete(interaction, this.client);
      }
    });
  }

  // private async onXuliaInteract(client: Client) {
  //   const server_id = "1063084604917030922";
  //   const channelId = "1286467309669449809";
  //   const prompt = "Escreva uma mensagem gentil e amorosa para minha namorada";

  //   try {
  //     // Step 1: Fetch the Discord channel
  //     const guild: any = await client.guilds.fetch(server_id);
  //     const channel = (await guild.channels.fetch(channelId)) as TextChannel;
  //     if (!channel || !channel.isTextBased()) {
  //       console.error("Invalid channel");
  //       return;
  //     }

  //     // Step 2: Make a request to OpenAI GPT API
  //     const gptResponse = await this.generateText(prompt);

  //     if (gptResponse) {
  //       // Step 3: Send the GPT response to the Discord channel
  //       await channel.send(gptResponse);
  //     } else {
  //       await channel.send("Sorry, I could not generate a response.");
  //     }
  //   } catch (error) {
  //     console.error("Error interacting with OpenAI or sending message:", error);
  //   }
  // }

  // private async generateText(prompt: string) {
  //   const key = "MACrD8yh8WYSx2toCghTO8wggJzMSyIOILBwcOi7";
  //   try {
  //     const response = await axios.post(
  //       "https://api.cohere.ai/generate",
  //       {
  //         model: "command-light", // Free model
  //         prompt: prompt,
  //         max_tokens: 100, // Limit the response length
  //         temperature: 0.7, // Adjust creativity level
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${key}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // console.log("Generated Text:", response.data.generations[0].text);
  //     return response.data.text;
  //   } catch (error) {
  //     console.error("Error generating text:", error);
  //   }
  // }

  private async onMessageInteract() {
    this.client.on("messageCreate", async (message) => {
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

      if (message.content === "Ping") {
        await message.channel.send("Eu que to rodando Pong");
      }

      if (
        message.content === "Eu quero criar um projeto" &&
        message.channelId === "1281857314587934751" &&
        message.channel instanceof TextChannel
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
          await message.channel.send("There was an error creating the thread.");
        }
      }
    });
  }
}
