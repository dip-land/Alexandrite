import { BaseCommandInteraction } from "discord.js";
import { applicationCommand } from "../../types/applicationCommand";

export const data: applicationCommand = {
    name: 'ping',
    description: 'Ping Command.'
};

export default async (interaction: BaseCommandInteraction): Promise<void> => {
    interaction.reply('pong!')
}
