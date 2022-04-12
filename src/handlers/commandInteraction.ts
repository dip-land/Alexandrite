import { BaseCommandInteraction } from "discord.js";

export default async (interaction: BaseCommandInteraction): Promise<void> => {
    const command = interaction.client.commands.get(interaction.commandName);
    const data = command.data;
    const channel = interaction.channel;
    if (data.disabled) return interaction.reply({ content: 'This command is currently disabled.', ephemeral: true });
    if (data.permissions && !interaction.memberPermissions.has(data.permissions)) return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
    if (data.nsfw && channel.type === 'GUILD_TEXT' && !channel.nsfw) return interaction.reply({ content: 'This command only works in NSFW channels.', ephemeral: true });
    try {
        command.default(interaction);
    } catch (error) {
        interaction.reply('Sorry, there was an error with this command.');
        console.log(error);
    }
};
