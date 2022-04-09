import { Client } from "discord.js";
import { sync } from '../handlers/userData';

export default (client: Client): void => {
    client.on("ready", async () => {
        console.log('Discord Online.');
        sync();
    });
};
