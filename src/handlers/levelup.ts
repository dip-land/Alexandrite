import { Message, Attachment, TextChannel } from "discord.js";
import { find, guildValue, update, userValue } from "./database";
import * as Canvas from 'canvas';
import { rectangle, text } from './canvas';

function send(channel: TextChannel, message: Message) {
    const canvas = Canvas.createCanvas(640, 174);
    const context = canvas.getContext('2d');

    new rectangle(context).setColor('#1b1b1c').setPosition(10, 10).setRadius(15).setSize(canvas.width - 20, canvas.height - 20).end();
    new rectangle(context).setColor('#ffffff20').setPosition(20, canvas.height - 25).setRadius(5).setSize(canvas.width - 40, 5).end();

    const attachment = new Attachment(canvas.toBuffer(), `${message.author.id}_LevelUp.png`);
    channel.send({ files: [attachment] });
}

export default async (message: Message, user: userValue) => {
    const levelUpChannel = (await find('guild', {guildID: message.guildId}) as guildValue)?.levelUpChannel
    if (levelUpChannel) {
        message.guild.channels.fetch(levelUpChannel).then(channel => {
            if( channel.isText()) {
                send(channel, message);
            }
        })
    } else {
        if( message.channel.isText()) {
            send(message.channel, message);
        }
    }
    //update('user', {userID: user.userID, guildID: message.guildId, xp: user.xp - ((user.level * 1000) * 1.35), level: user.level + 1, messages: user.messages + 1 });
}
