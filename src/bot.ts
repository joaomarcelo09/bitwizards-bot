import { Client, CommandInteraction, Interaction, REST, Routes, TextChannel, ThreadAutoArchiveDuration, } from "discord.js";
import * as commandModules from "./commands"
import { env } from './config/env'
import { SchedulerService } from "./jgorm/services/schedule-service";

var cron = require('node-cron');
const PROCESS = require("dotenv").config();

export class Bot {
    public commands = Object(commandModules)
    constructor(public readonly client: Client) {
        client.login(PROCESS.parsed.DISCORD_TOKEN);

        client.once("ready", (bot) => {
            console.log(`Logged in as ${bot.user.tag}`);
        });

        this.client.once('shardError', (error) => {
            console.error(`[bot]: something bad happened, ${error.message}`)
        })

        this.registerCommands()
        this.onMessageInteract()
        this.onInteractionCreate()
        this.registerCron()

    }

    private async registerCron() {
        cron.schedule('0 9 * * *', () => {
            SchedulerService.sendScheduleMessages(this.client)
        })
    }

    private async registerCommands() {
        const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
        const commands: any = [];
        for (const module of Object.values<{ data: unknown }>(commandModules)) {
            commands.push(module.data)
        }
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                {
                    body: commands,
                }
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }

    private async onInteractionCreate() {
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                const { commandName } = interaction
                this.commands[commandName].execute(interaction, this.client)
            }

            if (interaction.isAutocomplete()) {
                const { commandName } = interaction
                this.commands[commandName].autocomplete(interaction, this.client)
            }
        })
    }

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
                message.channelId === "1281857314587934751" && message.channel instanceof TextChannel
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
