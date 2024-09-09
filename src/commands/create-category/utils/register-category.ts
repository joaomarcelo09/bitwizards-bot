import { Guild, ChannelType } from "discord.js";

export async function createCategoryWithChannels(guild: Guild, categoryName: string) {
    try {
        // Create the category
        const category = await guild.channels.create({
            name: categoryName,
            type: ChannelType.GuildCategory,
            reason: `Category for ${categoryName}`,
        });

        // Example channels
        const channels = [
            { name: 'general-discussion', type: 0, topic: 'General topics' },
            { name: 'project-updates', type: ChannelType.GuildText, topic: 'Project updates' },
            { name: 'voice-chat', type: ChannelType.GuildVoice }
        ];

        for (const channel of channels) {
            await guild.channels.create({
                name: channel.name,
                type: channel.type,
                parent: category.id, // Set the channel under the category
                topic: channel.topic || '',
            });
        }

        console.log('Category and channels created successfully.');
    } catch (error) {
        console.error('Error creating category and channels:', error);
    }
}