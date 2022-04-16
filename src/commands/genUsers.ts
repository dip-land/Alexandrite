import { Message } from 'discord.js';
import { add } from '../handlers/database';

export default async (message: Message, args: any): Promise<void> => {
    let reply = await message.reply(`Started userGeneration ${args[0]}.`);
    try {
        let amount = parseInt(args[1]);
        do {
            let ID = makeid(18);
            console.log(ID, amount)
            add({ user: { guildID: message.guildId, id: ID } })
            amount--;
            if (amount === 0) reply.edit({ content: 'Finished userGeneration.' });
        } while (amount > 0);
    } catch (err) {
        reply.edit({ content: 'There was an error generating users.' })
        console.log(err);
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
