import { ApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { add, find, update } from '../../handlers/database';

export const data: ApplicationCommandData = {
    name: 'config',
    description: 'Configure bot settings.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'modlog',
            description: 'Channel to send moderation messages',
            type: ApplicationCommandOptionType.Channel
        },
        {
            name: 'userjoin',
            description: 'Channel to send user join messages',
            type: ApplicationCommandOptionType.Channel
        },
        {
            name: 'userleave',
            description: 'Channel to send user leave messages',
            type: ApplicationCommandOptionType.Channel
        },
        {
            name: 'levelup',
            description: 'Channel to send user level up messages',
            type: ApplicationCommandOptionType.Channel
        }
    ],
    defaultPermission: false
};

export const extendedData = {
    disabled: false,
    nsfw: false,
    permissions: "ADMINISTRATOR"
}

export default async (interaction: CommandInteraction): Promise<any> => {
    if (!await find('guild', { guildID: interaction.guildId })) add('guild', { guildID: interaction.guildId });
    const modlog = `${interaction.options.get('modlog')?.value}`;
    const userjoin = `${interaction.options.get('userjoin')?.value}`;
    const userleave = `${interaction.options.get('userleave')?.value}`;
    const levelup = `${interaction.options.get('levelup')?.value}`;
    update('guild', { guildID: interaction.guildId, levelUpChannel: levelup, modLogChannel: modlog, userJoinChannel: userjoin, userLeaveChannel: userleave });
    interaction.reply('Successfully updated settings.');
}
