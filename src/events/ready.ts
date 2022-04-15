import { Client } from 'discord.js';
import { sync } from '../handlers/database';

export default (client: Client): void => {
    client.on('ready', async () => {
        console.log('Discord Online.');
        sync();
    });
};
