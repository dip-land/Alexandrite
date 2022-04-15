import { BaseCommandInteraction, MessageAttachment } from 'discord.js';
import { applicationCommand } from '../../types/applicationCommand';
import { find, add, User } from '../../handlers/database';
import * as Canvas from 'canvas';
import { rectangle, progressBar, scaleFont, text } from '../../handlers/canvas';
import * as dominantColors from 'dominant-colors';

export const data: applicationCommand = {
    name: 'rank',
    description: 'Display your rank card or someone elses.',
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'User to display.'
        },
        {
            type: 'BOOLEAN',
            name: 'hide',
            description: 'Whether to hide the response or not.'
        }
    ]
};

export default async (interaction: BaseCommandInteraction): Promise<void> => {
    const data = interaction.options.data;
    const target = data[0]?.user || interaction.user;
    const hide = data[0]?.type === 'BOOLEAN' ? !!data[0]?.value : !!data[1]?.value || false;
    if (target.bot) return interaction.reply('Sadly bots cannot have rank cards...');
    let stats: User = await find({ user: { id: target.id, guildID: interaction.guildId } });
    if (!stats) {
        add({ user: { id: target.id, guildID: interaction.guildId } });
        stats = await find({ user: { id: target.id, guildID: interaction.guildId } });
    }
    const userXpPercent = stats.xp / ((stats.level * 1000) * 1.35);
    const fetchedUser = await target.fetch();
    const bannerURL = fetchedUser.bannerURL({ format: 'jpg', size: 512 });
    const userColor = fetchedUser.hexAccentColor || (await dominantColors.showColors(bannerURL, 1))[0];
    const width = 1400;
    const height = 500;
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext('2d');
    const radius = 40;

    context.shadowColor = '#272729A0';
    context.shadowBlur = 6;
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(0 + radius, 0);
    context.lineTo(0 + width - radius, 0);
    context.quadraticCurveTo(0 + width, 0, 0 + width, 0 + radius);
    context.lineTo(0 + width, 0 + height - radius);
    context.quadraticCurveTo(0 + width, 0 + height, 0 + width - radius, 0 + height);
    context.lineTo(0 + radius, 0 + height);
    context.quadraticCurveTo(0, 0 + height, 0, 0 + height - radius);
    context.lineTo(0, 0 + radius);
    context.quadraticCurveTo(0, 0, 0 + radius, 0);
    context.closePath();
    context.clip();

    if (fetchedUser.banner) {
        const background = await Canvas.loadImage(bannerURL);
        context.drawImage(background, 0, 0, width, height);
        new rectangle(context).setColor('#ffffff48').setPosition(10, 10).setRadius(radius - 10).setSize(width - 20, height - 20).end();
    } else {
        new rectangle(context).setColor('#28282a').setPosition(10, 10).setRadius(radius - 10).setSize(width - 20, height - 20).end();
    }

    new text(context).setText('Rank Card').setPosition(width / 2.5, height / 3.8).setFormating({ font: 'bold 56px arial', stroke: true, maxWidth: width / 2 }).setColor(userColor).end();

    new text(context)
        .setText(target.tag)
        .setPosition(width / 2.5, height / 2.3)
        .setFormating(
            {
                font: new scaleFont(canvas).setText(target.tag).setFormating({ font: 'arial', number: 450 }).end(),
                stroke: true,
                maxWidth: width / 2
            }
        )
        .setColor('#fff')
        .end();

    new text(context).setText(`Level - ${stats.level.toLocaleString()}`).setPosition(width / 2.5, height / 1.8).setFormating({ font: 'bold 56px arial', stroke: true, maxWidth: width / 2 }).setColor('#fff').end();

    new text(context).setText(`Messages - ${stats.messages.toLocaleString()}`).setPosition(width / 2.5, height / 1.5).setFormating({ stroke: true, maxWidth: width / 2 }).setColor('#fff').end();

    new rectangle(context).setColor('#1c1c1e').setPosition((width / 2.5) - 8, (height / 1.4) - 8).setRadius(36).setSize((width / 2) + 8, 64).end();
    new progressBar(context)
        .displayText(`${Math.floor(userXpPercent * 100)}% (${stats.xp}xp / ${(stats.level * 1000) * 1.35}xp)`, 'bold 40px arial', '#fff')
        .setColor(userColor)
        .setPercent(userXpPercent)
        .setPosition(width / 2.5, height / 1.4)
        .setRadius(28)
        .setSize(width / 2, 48)
        .end();

    context.beginPath();
    context.arc(height / 2, height / 2, 190, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(target.displayAvatarURL({ format: 'jpg', size: 512 }));
    context.drawImage(avatar, 60, 60, 380, 380);

    const attachment = new MessageAttachment(canvas.toBuffer(), `${target.id}_RankCard.png`);

    interaction.reply({ files: [attachment], ephemeral: hide });
}
