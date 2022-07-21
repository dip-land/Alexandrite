import { Client } from 'discord.js';
import log from '../handlers/log';
import { sync } from '../handlers/database';

export default (client: Client): void => {
    client.on('ready', async () => {
        new log().green({ bright: true }, 'Online.');
        sync();
    });
};
