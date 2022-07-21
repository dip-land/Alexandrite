import { Client, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'dotenv/config';
import { glob } from 'glob';
import log from './handlers/log';
import ready from './events/ready';
import guildMemberAdd from './events/guildMemberAdd';
import guildMemberRemove from './events/guildMemberRemove';
import messageCreate from './events/messageCreate';
import interactionCreate from './events/interactionCreate';

declare module 'discord.js' {
    interface Client {
        cooldowns: Map<any, any>
        commands: Map<any, any>
        REST: REST
    }
    interface ApplicationCommandData_ {
        nsfw?: boolean
        disabled?: boolean
    }
}

const client = new Client(
    {
        intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
    }
);

client.cooldowns = new Collection();
client.commands = new Collection();
client.REST = new REST().setToken(process.env.TOKEN);

glob('./dist/src/commands/**/*.js', function (err, res) {
    res.forEach(async cmd => {
        try {
            const command = require(cmd.replace('./dist/src', '.'));
            client.commands.set(command.data?.name, command)
        } catch (err) { new log().error(err) }
    });
})

ready(client);
guildMemberAdd(client);
guildMemberRemove(client);
messageCreate(client);
interactionCreate(client);

client.login(process.env.TOKEN);
