import { Message } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { command } from '../types/command';
import log from '../handlers/log';

export default async (message: Message, args: any): Promise<any> => {
    let reply = await message.reply(`Started refreshing application (/) commands.`);
    let commands = [];
    try {
        message.client.commands.forEach((command: command) => {
            if (!command.data) return;
            commands.push(command.data)
        })
        if (args && args === '-global') {
            await message.client.REST.put(
                Routes.applicationCommands(message.client.user.id),
                { body: commands }
            );
            await reply.edit({ content: 'Successfully reloaded application (/) commands.' });
        } else {
            await message.client.REST.put(
                Routes.applicationGuildCommands(message.client.user.id, message.guildId),
                { body: commands }
            );
            await reply.edit({ content: 'Successfully reloaded guild (/) commands.' });
        }
    } catch (err) {
        reply.edit({ content: 'There was an error reloading (/) commands, check console for more info.' })
        new log().error(err);
    }
}
