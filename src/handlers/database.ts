import { Message, Collection } from 'discord.js';
import { DataTypes, Sequelize } from 'sequelize';
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const cooldown: Collection<string, number> = new Collection();
const cooldownAmount = 30;

let users = sequelize.define('Users', {
    userID: {
        type: DataTypes.STRING,
        unique: true,
    },
    guildID: {
        type: DataTypes.STRING,
        unique: false,
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
    messages: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    }
});
let guilds = sequelize.define('Guilds', {
    guildID: {
        type: DataTypes.STRING,
        unique: true,
    },
    levelUpChannel: {
        type: DataTypes.STRING
    }
});

function add(options: { user?: { id: string, guildID: string }, guildID?: string }) {
    if (options.user) {
        users.create({ userID: options.user.id, guildID: options.user.guildID, xp: Math.floor(Math.random() * 20) + 10 });
        sync();
    } else if (options.guildID) {
        guilds.create({ guildID: options.guildID });
        sync();
    }
}

function remove(options: { user?: { id: string, guildID: string }, guildID?: string }) {
    if (options.user) {
        users.destroy({ where: { userID: options.user.id, guildID: options.user.guildID } });
        sync();
    } else if (options.guildID) {
        guilds.destroy({ where: { guildID: options.guildID } });
        sync();
    }
}

async function execute(message: Message) {
    if (message.author.bot) return;
    const foundUser = await find({ user: { id: message.author.id, guildID: message.guildId } });

    if (foundUser && cooldown.has(message.author.id)) {
        update({ user: { id: foundUser.userID, guildID: message.guildId, xp: foundUser.xp, level: foundUser.level, messages: foundUser.messages + 1 } });
        const expirationTime = cooldown.get(message.author.id) + (cooldownAmount * 1000);
        if (Date.now() < expirationTime) return;
    }

    cooldown.set(message.author.id, Date.now());
    setTimeout(() => cooldown.delete(message.author.id), (cooldownAmount * 1000));

    if (foundUser) {
        if (foundUser.xp >= ((foundUser.level * 1000) * 1.35)) {
            update({ user: { id: foundUser.userID, guildID: message.guildId, xp: foundUser.xp - ((foundUser.level * 1000) * 1.35), level: foundUser.level + 1, messages: foundUser.messages + 1 } });
        } else {
            update({ user: { id: foundUser.userID, guildID: message.guildId, xp: foundUser.xp + Math.floor(Math.random() * 20) + 10, level: foundUser.level, messages: foundUser.messages + 1 } });
        }
    } else {
        add({ user: { id: message.author.id, guildID: message.guildId } });
    }
}

async function find(options: { user?: { id: string, guildID: string }, guildID?: string }) {
    if (options.user) {
        const foundUser = await users.findOne({ where: { userID: options.user.id, guildID: options.user.guildID } });
        try {
            return foundUser.dataValues;
        } catch (error) {
            return foundUser?.dataValues;
        }
    } else if (options.guildID) {
        const foundGuild = await guilds.findOne({ where: { guildID: options.guildID } });
        try {
            return foundGuild.dataValues;
        } catch (error) {
            return foundGuild?.dataValues;
        }
    }
}

async function sort(guildID: string) {
    let _users = []
    let users_ = await users.findAll({ where: { guildID: guildID } })
    users_.forEach(user => _users.push(user.dataValues))

    return _users.sort((a, b) => ((b.xp / ((b.level * 1000) * 1.35)) + b.level * 100) - ((a.xp / ((a.level * 1000) * 1.35)) + a.level * 100));
}

function sync() {
    users.sync();
    guilds.sync();
}

function update(options: { user?: { id: string, guildID: string, xp: number, level: number, messages: number }, guild?: { ID: string, levelUpChannel: string } }) {
    if (options.user) {
        users.update(
            {
                xp: options.user.xp,
                level: options.user.level,
                messages: options.user.messages,
            },
            {
                where: {
                    userID: options.user.id,
                    guildID: options.user.guildID
                }
            }
        );
        sync();
    } else if (options.guild) {
        guilds.update(
            {
                levelUpChannel: options.guild.levelUpChannel
            },
            {
                where: {
                    guildID: options.guild.ID,
                }
            }
        );
        sync();
    }
}

declare module 'sequelize' {
    interface Model {
        dataValues: dataValues;
        _previousDataValues: dataValues;
        uniqno: number;
        _changed: Set<any>;
        _options: { isNewRecord: boolean }
    }
}

declare type dataValues = {
    id?: number
    userID?: string
    guildID?: string
    xp?: number
    level?: number
    levelUpChannel?: string
    messages?: number
    createdAt?: Date
    updatedAt?: Date
}

export { add, dataValues, execute, find, remove, sort, sync, update }
