import { type Message, type Client } from 'discord.js';
import { Routes } from 'discord-api-types/v9';

export default async (message: Message, client: Client, args: any): Promise<void> => {
    let reply = await message.reply(`Started refreshing application (/) commands.`);
    let cmds = [];
    try {
        client.commands.forEach((cmd) => {
            if (!cmd.data) return;
            cmds.push(cmd.data)
        })
        if (args && args === '-global') {
            await client.REST.put(
                Routes.applicationCommands(client.user.id),
                { body: cmds }
            );
            await reply.edit({ content: 'Successfully reloaded application (/) commands.' });
        } else {
            await client.REST.put(
                Routes.applicationGuildCommands(client.user.id, message.guildId),
                { body: cmds }
            );
            await reply.edit({ content: 'Successfully reloaded guild (/) commands.' });
        }
    } catch (err) {
        reply.edit({ content: 'There was an error reloading (/) commands, check console for more info.' })
        console.log(err);
    }
}
