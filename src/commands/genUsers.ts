import { Message } from 'discord.js';
import { add } from '../handlers/database';
import log from '../handlers/log';

export default async (message: Message, args: any): Promise<any> => {
    let reply = await message.reply(`Started userGeneration ${args[0]}.`);
    try {
        let amount = (+args[1]);
        do {
            let ID = makeid(18);
            new log().log(ID, amount);
            add('user', { guildID: message.guildId, userID: ID });
            amount--;
            if (amount === 0) reply.edit({ content: 'Finished userGeneration.' });
        } while (amount > 0);
    } catch (err) {
        reply.edit({ content: 'There was an error generating users.' });
        new log().error(err);
    }
}

function makeid(length: number) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
