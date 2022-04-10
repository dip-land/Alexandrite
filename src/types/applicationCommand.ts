import { ApplicationCommandOption } from "discord.js";

export type applicationCommand = {
    /**1-32 lowercase character name*/
    name: string,
    /**	1-100 character description for CHAT_INPUT commands, empty string for USER and MESSAGE commands*/
    description: string,
    /**the parameters for the command, max 25*/
    options?: ApplicationCommandOption[],
    /**Required permissions to use command*/
    permissions?: string,
    /**If the commmand can only be used in nsfw or dm channels*/
    nsfw?: boolean,
    /**If the command is disabled or not*/
    disabled?: boolean
}
