import { BaseCommandInteraction, Client } from "discord.js";

export default async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const command = client.commands.get(interaction.commandName);
    try {
        command.default(client, interaction);
    } catch (error) {
        interaction.reply('Sorry, there was an error with this command.');
        console.log(error);
    }
};
