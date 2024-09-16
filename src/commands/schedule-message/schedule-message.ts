import { ChannelType, CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SchedulerService } from "../../jgorm/services/schedule-service";

const daysOfWeek = [
    { name: 'Monday', value: 'Monday' },
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' },
    { name: 'Sunday', value: 'Sunday' }
];

export const data = new SlashCommandBuilder().setName('schedulemessage').setDescription('schedule a message to send in specific days at 9am').addStringOption((opt) =>
    opt.setName('message').setDescription('The message to send').setRequired(true))
    .addStringOption((opt) =>
        opt.setName('day_of_week')
            .setDescription('The day of the week to send message')
            .addChoices(daysOfWeek).setRequired(true))
    .addChannelOption((opt) =>
        opt.setName('channel')
            .setDescription('The channel to send the message to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText));

export async function execute(interaction: CommandInteraction) {

    await interaction.deferReply();
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    if (!member) {
        await interaction.followUp('Member not found.');
        return;
    }

    const hasAdminRole = member.roles.cache.some(role => role.permissions.has(PermissionFlagsBits.Administrator));

    if (!hasAdminRole) {
        await interaction.followUp(`You don't have a role with the Administrator permission.`);
        return;
    }

    const message = interaction.options.get('message');
    const channel = interaction.options.get('channel');
    const day_of_week = interaction.options.get('day_of_week');

    if (!message?.value || !day_of_week?.value || !channel?.value) {
        return await interaction.followUp(`The command was incomplete`)
    }
    const data = {
        message: message.value,
        day_of_week: day_of_week?.value,
        time: '09:00',
        channel_id: channel?.value,
        server_id: interaction.guildId
    }
    await SchedulerService.scheduleMessage(data)
    return interaction.followUp(`message scheduled successfully`)
}