import { Client, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Sequelize } from 'sequelize';
import { start } from './handlers/database';
import 'dotenv/config';
import { glob } from 'glob';
import interactionCreate from './events/interactionCreate';
import messageCreate from './events/messageCreate';
import ready from './events/ready';

declare module 'discord.js' {
    interface Client {
        cooldowns: Map<any, any>
        commands: Map<any, any>
        REST: REST
    }
}

const client = new Client(
    {
        intents: [
            'GUILDS',
            'GUILD_PRESENCES',
            'GUILD_MEMBERS',
            'GUILD_BANS',
            'GUILD_INVITES',
            'GUILD_MESSAGES',
            'GUILD_VOICE_STATES',
        ]
    }
)

client.cooldowns = new Collection();
client.commands = new Collection();
client.REST = new REST({ version: '9' }).setToken(process.env.TOKEN);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});
start(sequelize);

glob('./dist/src/commands/**/*.js', function (err, res) {
    res.forEach(async cmd => {
        try {
            const command = require(cmd.replace('./dist/src', '.'));
            client.commands.set(command.data?.name, command)
        } catch (err) { console.log(err) }
    });
})

ready(client);
messageCreate(client);
interactionCreate(client);

client.login(process.env.TOKEN);
