import { ApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, Attachment, CommandInteraction } from 'discord.js';
import { sort } from '../../handlers/database';
import * as Canvas from 'canvas';
import { rectangle, text } from '../../handlers/canvas';

const usersPerPage = 10;

export const data: ApplicationCommandData = {
    name: 'levels',
    description: 'Shows the leaderboard for current server',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'page',
            description: `leaderboard page, each page displays ${usersPerPage} users`,
            type: ApplicationCommandOptionType.Integer
        },
        {
            name: 'hide',
            description: 'Whether to hide the response or not',
            type: ApplicationCommandOptionType.Boolean
        }
    ]
};

export default async (interaction: CommandInteraction): Promise<any> => {
    const hide = !!interaction.options.get('hide')?.value || false;
    await interaction.deferReply({ ephemeral: hide });
    const page = (+`${interaction.options.get('page')?.value}`) || 1;
    const users = await sort('users', { guildID: interaction.guildId }, true);
    const pages = users.length / usersPerPage;
    if (page > Math.ceil(pages) || page <= 0) return await interaction.editReply({ content: 'Requested page is invalid.' });
    const width = 1400;
    const height = (users.length * 120) <= usersPerPage * 140 ? (users.length * 140) + 280 : (usersPerPage * 140) + 280;
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext('2d');
    const radius = 40;
    const usersDisplayed = users.slice((page - 1) * usersPerPage, page === 1 ? usersPerPage : page * usersPerPage);

    //not sure if this banner code even works, cant test right now...
    if (interaction.guild.banner) {
        const background = await Canvas.loadImage(interaction.guild.bannerURL());
        context.drawImage(background, 0, 0, width, height);
        new rectangle(context).setColor('#ffffff48').setPosition(10, 10).setRadius(radius - 10).setSize(width - 20, height - 20).end();
    } else {
        new rectangle(context).setColor('#28282a').setPosition(10, 10).setRadius(radius - 10).setSize(width - 20, height - 20).end();
    }

    //Rank column
    new rectangle(context).setColor('#00000040').setPosition(32, 140 - 114).setSize(200, 90).setRadius(radius - 10).end();
    new text(context).setColor('#fff').setFormating({ align: 'center', font: 'bold 62px arial', maxWidth: 150 }).setPosition(132, 140 - 46).setText(`RANK`).end();
    //User column
    new rectangle(context).setColor('#00000040').setPosition(252, 140 - 114).setSize(width / 2.2, 90).setRadius(radius - 10).end();
    new text(context).setColor('#fff').setFormating({ align: 'left', maxWidth: (width / 2.1) - 46 }).setPosition(272, 140 - 46).setText(`USER`).end();
    //Level column
    new rectangle(context).setColor('#00000040').setPosition(272 + (width / 2.2), 140 - 114).setSize(170, 90).setRadius(radius - 10).end();
    new text(context).setColor('#fff').setFormating({ align: 'center', maxWidth: 126 }).setPosition(295 + (width / 2), 140 - 46).setText(`LEVEL`).end();
    //XP columns
    new rectangle(context).setColor('#00000040').setPosition(462 + (width / 2.2), 140 - 114).setSize(268, 90).setRadius(radius - 10).end();
    new text(context).setColor('#fff').setFormating({ align: 'center', maxWidth: 244 }).setPosition(532 + (width / 2), 140 - 46).setText(`XP`).end();
    //Pages
    new rectangle(context).setColor('#00000040').setPosition((width / 2) - ((width / 2) / 2), height - 114).setSize(width / 2, 90).setRadius(radius - 10).end();
    new text(context).setColor('#fff').setFormating({ align: 'center', maxWidth: (width / 2) - 40 }).setPosition(width / 2, height - 46).setText(`Page ${page > pages ? Math.ceil(pages) : page} / ${Math.ceil(pages)}`).end();
    usersDisplayed.forEach(async (user, index) => {
        const yValue = (140 * (index + 1)) + 140;
        //Rank column
        if (index + 1 + ((page - 1) * usersPerPage) === 1) new rectangle(context).setColor('#e3bd14').setPosition(32, yValue - 114).setSize(200, 90).setRadius(radius - 10).end();
        if (index + 1 + ((page - 1) * usersPerPage) === 2) new rectangle(context).setColor('#88888c').setPosition(32, yValue - 114).setSize(200, 90).setRadius(radius - 10).end();
        if (index + 1 + ((page - 1) * usersPerPage) === 3) new rectangle(context).setColor('#bf6d15').setPosition(32, yValue - 114).setSize(200, 90).setRadius(radius - 10).end();
        if (index + 1 + ((page - 1) * usersPerPage) > 3) new rectangle(context).setColor('#00000040').setPosition(32, yValue - 114).setSize(200, 90).setRadius(radius - 10).end();
        //User column
        new rectangle(context).setColor('#00000040').setPosition(252, yValue - 114).setSize(width / 2.2, 90).setRadius(radius - 10).end();
        //Level column
        new rectangle(context).setColor('#00000040').setPosition(272 + (width / 2.2), yValue - 114).setSize(170, 90).setRadius(radius - 10).end();
        //XP column
        new rectangle(context).setColor('#00000040').setPosition(462 + (width / 2.2), yValue - 114).setSize(268, 90).setRadius(radius - 10).end();
        try {
            let fetchedUser = (await interaction.guild.members.fetch(user.userID)).user;
            setupUser(fetchedUser, user, index, yValue);

            if (index + 1 === usersDisplayed.length) send();
        } catch (err) {
            let erroredUser = { tag: user.userID }
            setupUser(erroredUser, user, index, yValue);
            if (index + 1 === usersDisplayed.length) send();
        }
    })

    async function setupUser(user: any, stats: any, index: number, yValue: number) {
        //rank
        new text(context).setColor('#fff').setFormating({ align: 'center', font: 'bold 62px arial', maxWidth: 150 }).setPosition(132, yValue - 46).setText(`${index + 1 + ((page - 1) * usersPerPage)}`).end();
        //user
        new text(context).setColor('#fff').setFormating({ align: 'left', maxWidth: (width / 2.2) - 46 }).setPosition(272, yValue - 46).setText(`${user.tag}`).end();
        //level
        new text(context).setColor('#fff').setFormating({ align: 'center', maxWidth: 126 }).setPosition(295 + (width / 2), yValue - 46).setText(`${stats.level}`).end();
        //xp
        new text(context).setColor('#fff').setFormating({ align: 'center', maxWidth: 244 }).setPosition(532 + (width / 2), yValue - 46).setText(`${stats.xp} / ${(stats.level * 1000) * 1.35}`).end();
    }

    async function send() {
        const attachment = new Attachment(canvas.toBuffer(), `${interaction.guildId}_LeaderBoard.png`);
        await interaction.editReply({ files: [attachment] });
    }
}
