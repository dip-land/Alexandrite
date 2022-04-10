import { Message, Client } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { command } from "../types/command";

export default async (message: Message, client: Client, args: any): Promise<void> => {
    let reply = await message.reply(`Started refreshing application (/) commands.`);
    let commands = [];
    try {
        client.commands.forEach((command:command) => {
            if (!command.data) return;
            let newOptions;
            if(command.data?.options) {
                let a = JSON.stringify(command.data?.options);
                newOptions = JSON.parse(
                    a.replaceAll('"type":"SUB_COMMAND"', '"type":1')
                    .replaceAll('"type":"SUB_COMMAND_GROUP"', '"type":2')
                    .replaceAll('"type":"STRING"', '"type":3')
                    .replaceAll('"type":"INTEGER"', '"type":4')
                    .replaceAll('"type":"BOOLEAN"', '"type":5')
                    .replaceAll('"type":"USER"', '"type":6')
                    .replaceAll('"type":"CHANNEL"', '"type":7')
                    .replaceAll('"type":"ROLE"', '"type":8')
                    .replaceAll('"type":"MENTIONABLE"', '"type":9')
                    .replaceAll('"type":"NUMBER"', '"type":10')
                    .replaceAll('"type":"ATTACHMENT"', '"type":11')
                );
            }
            let data = {
                name: command.data?.name,
                description: command.data?.description,
                options: newOptions || [],
            }
            commands.push(data)
        })
        if (args && args === '-global') {
            await client.REST.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            await reply.edit({ content: 'Successfully reloaded application (/) commands.' });
        } else {
            await client.REST.put(
                Routes.applicationGuildCommands(client.user.id, message.guildId),
                { body: commands }
            );
            await reply.edit({ content: 'Successfully reloaded guild (/) commands.' });
        }
    } catch (err) {
        reply.edit({ content: 'There was an error reloading (/) commands, check console for more info.' })
        console.log(err);
    }
}
