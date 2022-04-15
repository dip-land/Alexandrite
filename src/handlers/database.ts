import { Message } from 'discord.js';
import { Model, DataTypes } from 'sequelize';

let users: Model = null;
let guilds: Model = null;

function add(options: { userID?: string, guildID?: string }) {
    if (options.userID) {
        users.create({ userID: options.userID });
    } else if (options.guildID) {
        guilds.create({ guildID: options.guildID });
    }
}

function delete_(options: { userID?: string, guildID?: string }) {
    if (options.userID) {
        users.destroy({ where: { userID: options.userID } });
    } else if (options.guildID) {
        guilds.destroy({ where: { guildID: options.guildID } });
    }
}

async function execute(message: Message) {
    if (message.author.bot) return;
    let foundUser: User = await find({ userID: `U${message.author.id}; G${message.guildId};` });
    if (foundUser) {
        if (foundUser.xp >= ((foundUser.level * 1000) * 1.35)) {
            update({ user: { ID: foundUser.userID, xp: 0, level: foundUser.level + 1, messages: foundUser.messages + 1 } });
        } else {
            update({ user: { ID: foundUser.userID, xp: foundUser.xp + Math.floor(Math.random() * 20) + 10, level: foundUser.level, messages: foundUser.messages + 1 } });
        }
    } else {
        add({ userID: `U${message.author.id}; G${message.guildId};` });
    }
}

async function find(options: { userID?: string, guildID?: string }) {
    if (options.userID) {
        const foundUser = await users.findOne({ where: { userID: options.userID } });
        try {
            return foundUser.dataValues;
        } catch (error) {
            return foundUser;
        }
    } else if (options.guildID) {
        const foundUser = await guilds.findOne({ where: { guildID: options.guildID } });
        try {
            return foundUser.dataValues;
        } catch (error) {
            return foundUser;
        }
    }
}

function start(db) {
    users = db.define('Users', {
        userID: {
            type: DataTypes.STRING,
            unique: true,
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
    guilds = db.define('Guilds', {
        guildID: {
            type: DataTypes.STRING,
            unique: true,
        }
    })
}

function sync() {
    users.sync();
    guilds.sync();
}

function update(options: { user?: { ID: string, xp: number, level: number, messages: number }, guild?: { ID: string } }) {
    if (options.user) {
        users.update(
            {
                xp: options.user.xp,
                level: options.user.level,
                messages: options.user.messages,
            },
            {
                where: {
                    userID: options.user.ID,
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

declare module "sequelize" {
    interface Model {
        create(obj: {});
        destroy(pointer: { where: {} });
        findOne(pointer: { where: {} });
        sync();
    }
}

declare type User = {
    id: number,
    userID: string,
    xp: number,
    level: number,
    messages: number,
    createdAt: Date,
    updatedAt: Date
}

export { add, delete_, execute, find, start, sync, update, User }
