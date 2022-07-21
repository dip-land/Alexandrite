import { Client } from 'discord.js';
import { find, guildValue } from '../handlers/database';

export default (client: Client): void => {
    client.on('guildMemberAdd', async (member) => {
        let user = member.user;
        let userJoined = Math.round(Date.now() / 1000);
        let userCreated = Math.round(user.createdTimestamp / 1000);
        let guildStats = await find('guild', { guildID: member.guild.id }) as guildValue;
        if (!guildStats?.userJoinChannel) return;
        let channel = await member.guild.channels.fetch(guildStats.userJoinChannel);
        if (!channel.isTextBased()) return;
        channel.send({
            embeds: [{
                author: { name: `${user.tag} (${user.id})`, icon_url: user.displayAvatarURL() },
                description: `Username: <@${user.id}> - \`${user.tag}\` (${user.id})\nCreated: <t:${userCreated}:f> (<t:${userCreated}:R>)\nJoined: <t:${userJoined}:f> (<t:${userJoined}:R>)`,
                color: 65280,
                footer: { text: 'User Joined' },
                timestamp: new Date(Date.now()).toISOString()
            }]
        });
    });
};
