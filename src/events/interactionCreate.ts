import { Client, Interaction } from 'discord.js';
import log from '../handlers/log';
import commandInteraction from '../handlers/commandInteraction';

export default (client: Client): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isAutocomplete()) new log().log(interaction);
        if (interaction.isButton()) new log().log(interaction);
        if (interaction.isCommand()) commandInteraction(interaction);
        if (interaction.isContextMenuCommand()) new log().log(interaction);
        if (interaction.isMessageComponent()) new log().log(interaction);
        if (interaction.isMessageContextMenuCommand()) new log().log(interaction);
        if (interaction.isSelectMenu()) new log().log(interaction);
        if (interaction.isUserContextMenuCommand()) new log().log(interaction);
    });
};
