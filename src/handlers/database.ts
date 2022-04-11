import { Message } from 'discord.js';
import { Model, DataTypes } from 'sequelize';

let database: Model = null;

function add(userID: string) {
    database.create({ userID: userID });
}

function delete_(userID: string) {
    database.destroy({ where: { userID: userID } });
}

async function execute(message: Message) {
    if (message.author.bot) return;
    let foundUser: User = await find(`U${message.author.id}; G${message.guildId};`);
    if (foundUser) {
        if (foundUser.xp >= ((foundUser.level * 1000) * 1.35)) {
            update(foundUser.userID, 0, foundUser.level + 1, foundUser.messages + 1);
        } else {
            update(foundUser.userID, foundUser.xp + Math.floor(Math.random() * 20) + 10, foundUser.level, foundUser.messages + 1);
        }
    } else {
        add(`U${message.author.id}; G${message.guildId};`);
    }
}

async function find(userID: string) {
    const foundUser = await database.findOne({ where: { userID: userID } });
    try {
        return foundUser.dataValues;
    } catch (error) {
        return foundUser;
    }
}

function start(db) {
    database = db.define('Users', {
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
    })
}

function sync() {
    database.sync();
}

function update(userID: string, xp: number, level: number, messages: number) {
    database.update(
        {
            xp: xp,
            level: level,
            messages: messages,
        },
        {
            where: {
                userID: userID,
            }
        }
    );
}

declare module "sequelize" {
    interface Model {
        create(obj: {})
        destroy(pointer: { where: {} });
        findOne(pointer: { where: {} });
        sync();
    }
}

declare type User = {
    userID: string,
    xp: number,
    level: number,
    messages: number
}

export { add, delete_, execute, find, start, sync, update }
