import { Client, Message } from "discord.js";
import { execute } from '../handlers/database';
import deploy from '../commands/deploy';
import { prefixes } from '../../config';

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        let prefix = prefixes.find(p => message.content.startsWith(p));
        if (message.content === `${prefix}deploy` && message.author.id === '439039443744063488') {
            deploy(message, client, message.content.slice(prefix.length).trim().split(/ +/));
        }
        execute(message);
    });
};
