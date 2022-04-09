import { BaseCommandInteraction, Client } from "discord.js";

export const data = {
    name: 'ping',
    name_localizations: undefined,
    description: 'undefined',
    description_localizations: undefined,
    options: [],
    defaultPermission: undefined
};

export default async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    interaction.reply('pong!')
}
