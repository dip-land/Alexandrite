import { Message } from 'discord.js';
import { ModelStatic, DataTypes, Sequelize } from 'sequelize';
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

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
    }
});

function add(options: { user?: { id: string, guildID: string }, guildID?: string }) {
    if (options.user) {
        users.create({ userID: options.user.id, guildID: options.user.guildID });
    } else if (options.guildID) {
        guilds.create({ guildID: options.guildID });
    }
}

function delete_(options: { user?: { id: string, guildID: string }, guildID?: string }) {
    if (options.user) {
        users.destroy({ where: { userID: options.user.id, guildID: options.user.guildID } });
    } else if (options.guildID) {
        guilds.destroy({ where: { guildID: options.guildID } });
    }
}

async function execute(message: Message) {
    if (message.author.bot) return;
    let foundUser = await find({ user: { id: message.author.id, guildID: message.guildId } });
    if (foundUser) {
        if (foundUser.xp >= ((foundUser.level * 1000) * 1.35)) {
            update({ user: { id: foundUser.userID, guildID: message.guildId, xp: 0, level: foundUser.level + 1, messages: foundUser.messages + 1 } });
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

async function order(guildID) {
    let allUsers = await users.findAll({where: {guildID :guildID}});
    console.log(allUsers)
}

function sync() {
    users.sync();
    guilds.sync();
}

function update(options: { user?: { id: string, guildID: string, xp: number, level: number, messages: number }, guild?: { ID: string } }) {
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
    } else if (options.guild) {
        guilds.update(
            {
            },
            {
                where: {
                    guildID: options.guild.ID,
                }
            }
        );
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
    id?: number,
    userID?: string,
    guildID?: string,
    xp?: number,
    level?: number,
    messages?: number,
    createdAt?: Date,
    updatedAt?: Date
}

export { add, delete_, execute, find, order, sync, update }
