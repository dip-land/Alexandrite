import { Client } from 'discord.js';
import { find, guildValue } from '../handlers/database';

export default (client: Client): void => {
    client.on('guildMemberRemove', async (member) => {
        let user = member.user;
        let userLeft = Math.round(Date.now() / 1000);
        let userCreated = Math.round(user.createdTimestamp / 1000);
        let guildStats = await find('guild', { guildID: member.guild.id }) as guildValue;
        if (!guildStats?.userLeaveChannel) return;
        let channel = await member.guild.channels.fetch(guildStats.userLeaveChannel);
        if (!channel.isTextBased()) return;
        channel.send({
            embeds: [{
                author: { name: `${user.tag} (${user.id})`, icon_url: user.displayAvatarURL() },
                description: `Username: <@${user.id}> - \`${user.tag}\` (${user.id})\nCreated: <t:${userCreated}:f> (<t:${userCreated}:R>)\nJoined: <t:${userLeft}:f> (<t:${userLeft}:R>)`,
                color: 3092790,
                footer: { text: 'User Left' },
                timestamp: new Date(Date.now()).toISOString()
            }]
        });
    });
};
