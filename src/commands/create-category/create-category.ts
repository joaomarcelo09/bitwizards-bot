import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createCategoryWithChannels } from "./utils/register-category";

export const data = new SlashCommandBuilder().setName('createnewcategory').setDescription('creates a category with channel template').addStringOption((option) =>
    option.setName('category').setDescription('Write a name to your category').setAutocomplete(true).setRequired(true)
)

export async function execute(interaction: CommandInteraction) {
    console.log('bateu')
    await interaction.deferReply();
    try {
        const categoryName = interaction.options.get('category')
        const formatName = categoryName?.value as string
        const guild = interaction.guild!

        await createCategoryWithChannels(guild, formatName)
        await interaction.followUp(`Category "${categoryName}" created with channels`)
    } catch (error) {
        console.error('Error creating category:', error);
        await interaction.followUp('There was an error creating the category.');
    }
}
