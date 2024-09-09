import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createCategoryWithChannels } from "./utils/register-category";

export const data = new SlashCommandBuilder().setName('createcategory').setDescription('creates a category with channel template').addStringOption((option) =>
    option.setName('category').setDescription('Write a name to your category').setRequired(true)
)

export async function execute(interaction: CommandInteraction) {

    const requiredRoleId = "1072250960837099700"

    await interaction.deferReply();

    const member = await interaction.guild?.members.fetch(interaction.user.id)

    if (!member?.roles.cache.has(requiredRoleId)) {
        await interaction.followUp(`You don't have permission to create a new channel`)
        return
    }

    try {
        const categoryName = interaction.options.get('category')
        const formatName = categoryName?.value as string
        const guild = interaction.guild!

        await createCategoryWithChannels(guild, formatName)
        await interaction.followUp(`Category "${categoryName}" created with channels`)
    } catch (error) {
        await interaction.followUp('There was an error creating the category.');
    }
}
