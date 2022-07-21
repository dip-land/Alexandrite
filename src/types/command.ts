import { ApplicationCommandData, PermissionResolvable, CommandInteraction } from "discord.js";

export type command = {
    data: ApplicationCommandData,
    extendedData: {
        disabled: boolean,
        nsfw: boolean,
        permissions: PermissionResolvable
    },
    default: (interaction: CommandInteraction) => Promise<any>
}
