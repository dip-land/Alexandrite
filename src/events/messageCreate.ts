import { Client, Message } from 'discord.js';
import { execute } from '../handlers/database';
import deploy from '../commands/deploy';
import genUsers from '../commands/genUsers';
import { prefixes } from '../../config';

export default (client: Client): void => {
    client.on('messageCreate', async (message: Message) => {
        let prefix = prefixes.find(p => message.content.startsWith(p));
        if (message.content === `${prefix}deploy` && message.author.id === '439039443744063488') {
            deploy(message, message.content.slice(prefix.length).trim().split(/ +/));
        }
        if (message.content.startsWith(`${prefix}generateUsers`) && message.author.id === '439039443744063488') {
            genUsers(message, message.content.slice(prefix.length).trim().split(/ +/));
        }
        execute(message);
    });
};
