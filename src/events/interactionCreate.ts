import { Client, Interaction } from "discord.js";
import commandInteraction from "../handlers/commandInteraction";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        //if (interaction.isApplicationCommand()) console.log(interaction);
        if (interaction.isAutocomplete()) console.log(interaction);
        if (interaction.isButton()) console.log(interaction);
        if (interaction.isCommand()) commandInteraction(client, interaction);
        if (interaction.isContextMenu()) console.log(interaction);
        if (interaction.isMessageComponent()) console.log(interaction);
        if (interaction.isMessageContextMenu()) console.log(interaction);
        if (interaction.isSelectMenu()) console.log(interaction);
        if (interaction.isUserContextMenu()) console.log(interaction);
    });
};
