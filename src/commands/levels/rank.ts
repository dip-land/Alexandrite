import { ApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, Attachment, CommandInteraction } from 'discord.js';
import { find, maxXP, userValue } from '../../handlers/database';
import * as Canvas from 'canvas';
import { circle, progressBar, rectangle, text } from '../../handlers/canvas';
import * as dominantColors from 'dominant-colors';
import { testColors } from '../../handlers/colors';

export const data: ApplicationCommandData = {
    name: 'rank',
    description: 'Display your rank card or someone elses',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'target',
            description: 'User to display',
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'hide',
            description: 'Whether to hide the response or not',
            type: ApplicationCommandOptionType.Boolean
        }
    ]
};

export default async (interaction: CommandInteraction): Promise<any> => {
    const target = interaction.options.getUser('target', false) || interaction.user;
    const hide = !!interaction.options.get('hide')?.value || false;
    await interaction.deferReply({ ephemeral: hide });
    if (target.bot) return interaction.editReply('Sadly bots cannot have rank cards...');
    let stats = await find('user', { userID: target.id, guildID: interaction.guildId }) as userValue;
    if (!stats) {
        stats = {
            userID: target.id,
            guildID: interaction.guildId,
            xp: 0,
            level: 1,
            messages: 0
        };
    }
    const fetchedUser = await target.fetch();
    const bannerURL = fetchedUser.bannerURL({ extension: 'jpg', size: 512 });
    let userColor: string = testColors(fetchedUser.hexAccentColor, '#1b1b1c') || testColors((await dominantColors.showColors(bannerURL, 1))[0], '#1b1b1c') || '#ffffff';
    if (userColor === 'P') userColor = '#ffffff';
    const width = 480;
    const height = 174;
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.save();
    context.shadowColor = 'black';
    context.shadowBlur = 6;
    new rectangle(context).setColor('#1b1b1c').setPosition(10, 10).setRadius(15).setSize(width - 20, height - 20).end();
    context.restore();

    if (fetchedUser.banner) {
        context.save();
        new rectangle(context).setClip(true).setPosition(10, 10).setRadius(15).setSize(width - 20, height - 20).end();
        context.globalAlpha = 0.25;
        const background = await Canvas.loadImage(bannerURL)
        context.drawImage(background, 0, 0, width, height);
        context.restore();
    }

    context.save();
    context.shadowColor = '#00000080';
    context.shadowBlur = 6;
    new rectangle(context).setColor('#ffffff20').setPosition(20, height - 25).setRadius(2.5).setSize(width - 40, 5).end();
    new progressBar(context).setColor(userColor).setPercent(stats.xp / maxXP(stats)).setPosition(20, height - 25).setRadius(2.5).setSize(width - 40, 5).end();

    new text(context).setColor(userColor).setFormating({ align: 'center', font: 'bold 36px arial', maxWidth: 290 }).setPosition(302, height / 2).setText(fetchedUser.username).end();
    new text(context).setColor('#ffffffb0').setFormating({ align: 'right', font: 'bold 12px arial' }).setPosition(width - 30, height - 30).setText(`LEVEL ${stats.level}`).end();
    new text(context).setColor('#ffffffb0').setFormating({ align: 'left', font: 'bold 12px arial' }).setPosition(154, height - 30).setText(`${stats.xp} / ${maxXP(stats)} EXP`).end();
    context.restore();

    context.save();
    new circle(context).setClip(true).setPosition(20, 20).setSize(height - 55).end();
    const avatar = await Canvas.loadImage(target.displayAvatarURL({ extension: 'jpg', size: 128 }));
    context.drawImage(avatar, 20, 20, height - 55, height - 55);
    context.restore();

    const attachment = new Attachment(canvas.toBuffer(), `${target.id}_RankCard.png`);

    interaction.editReply({ files: [attachment] });
}
