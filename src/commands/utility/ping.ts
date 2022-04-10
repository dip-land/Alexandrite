import { BaseCommandInteraction, Client } from "discord.js";
import { applicationCommand } from "../../types/applicationCommand";

export const data: applicationCommand = {
    name: 'ping',
    description: 'Ping Command.'
};

export default async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    interaction.reply('pong!')
}
