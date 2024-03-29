import { CommandInteraction } from 'discord.js';
import { command } from '../types/command';
import log from './log';

export default async (interaction: CommandInteraction): Promise<any> => {
    const command : command = interaction.client.commands.get(interaction.commandName);
    const data = command?.extendedData;
    const channel = interaction.channel;
    if (data?.disabled) return interaction.reply({ content: 'This command is currently disabled.', ephemeral: true });
    if (data?.permissions && !interaction.memberPermissions.has(data?.permissions)) return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
    if (data?.nsfw && channel.isText() && !channel.nsfw) return interaction.reply({ content: 'This command only works in NSFW channels.', ephemeral: true });
    try {
        command.default(interaction);
    } catch (err) {
        interaction.reply('Sorry, there was an error with this command.');
        new log().error(err);
    }
};
