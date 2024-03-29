import { ApplicationCommandData, ApplicationCommandType, CommandInteraction } from 'discord.js';

export const data: ApplicationCommandData = {
    name: 'ping',
    description: 'Ping Command.',
    type: ApplicationCommandType.ChatInput
};

export default async (interaction: CommandInteraction): Promise<any> => {
    interaction.reply('pong!');
}
