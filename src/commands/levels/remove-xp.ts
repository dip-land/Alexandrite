import { ApplicationCommandData, ApplicationCommandType, CommandInteraction } from 'discord.js';

export const data: ApplicationCommandData = {
    name: 'removexp',
    description: 'Placholder',
    type: ApplicationCommandType.ChatInput,
    defaultPermission: false
};

export default async (interaction: CommandInteraction): Promise<any> => {
    interaction.reply('This command currently does not work.');
}
