import { Message, Collection } from 'discord.js';
import { DataTypes, Sequelize } from 'sequelize';
//import levelup from './levelup';
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: './databases/main.sqlite',
});
const cooldown: Collection<string, number> = new Collection();
const cooldownAmount = 30;

let users = sequelize.define('Users', {
    userID: {
        type: DataTypes.STRING
    },
    guildID: {
        type: DataTypes.STRING
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
    },
    modLogChannel: {
        type: DataTypes.STRING
    },
    userJoinChannel: {
        type: DataTypes.STRING
    },
    userLeaveChannel: {
        type: DataTypes.STRING
    }
});
let cases = sequelize.define('Guilds', {
    guildID: {
        type: DataTypes.STRING,
        unique: true,
    },
    caseID: {
        type: DataTypes.STRING,
        unique: true,
    },
    number: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    oldReason: {
        type: DataTypes.STRING
    },
    updatedReason: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    }
});

function add(type: optionsType, data: dataValues) {
    if (type === 'user') {
        const user = data as userValue;
        users.create({ userID: user.userID, guildID: user.guildID, xp: user.xp, level: user.level, messages: user.messages });
    }
    if (type === 'guild') {
        const guild = data as guildValue;
        guilds.create({ guildID: guild.guildID, levelUpChannel: guild.levelUpChannel, modLogChannel: guild.modLogChannel, userJoinChannel: guild.userJoinChannel, userLeaveChannel: guild.userLeaveChannel });
    }
    if (type === 'case') {
        const case_ = data as caseValue;
        cases.create({ guildID: case_.guildID, caseID: case_.caseID, number: case_.number, oldReason: case_.oldReason, updatedReason: case_.updatedReason, type: case_.type });
    }
}

function remove(type: optionsType, data: dataValues) {
    if (type === 'user') {
        const user = data as userValue;
        users.destroy({ where: { userID: user.id, guildID: user.guildID } });
    }
    if (type === 'guild') {
        const guild = data as guildValue;
        guilds.destroy({ where: { guildID: guild.guildID } });
    }
    if (type === 'case') {
        const case_ = data as caseValue;
        cases.destroy({ where: { guildID: case_.guildID, caseID: case_.caseID } });
    }
    sync();
}

async function find(type: optionsType, data: dataValues) {
    if (type === 'user') {
        const user = data as userValue;
        const foundUser = await users.findOne({ where: { userID: user.id, guildID: user.guildID } });
        try {
            return foundUser.dataValues;
        } catch (err) {
            return foundUser?.dataValues;
        }
    }
    if (type === 'guild') {
        const guild = data as guildValue;
        const foundGuild = await guilds.findOne({ where: { guildID: guild.guildID } });
        try {
            return foundGuild.dataValues;
        } catch (err) {
            return foundGuild?.dataValues;
        }
    }
    if (type === 'case') {
        const case_ = data as caseValue;
        const foundCase = await guilds.findOne({ where: { guildID: case_.guildID, caseID: case_.caseID } });
        try {
            return foundCase.dataValues;
        } catch (err) {
            return foundCase?.dataValues;
        }
    }
}

async function update(type: optionsType, data: dataValues) {
    if (type === 'user') {
        const user = data as userValue;
        users.update(user, { where: { userID: user.id, guildID: user.guildID } });
    }
    if (type === 'guild') {
        const guild = data as guildValue;
        guilds.update(guild, { where: { guildID: guild.guildID } });
    }
    if (type === 'case') {
        const case_ = data as caseValue;
        cases.update(case_, { where: { guildID: case_.guildID, caseID: case_.caseID } });
    }
    sync();
}

function canLevelUp(user: userValue) {
    return user.xp >= Math.round((user.level * 1000) * (user.level * 1.35));
}

async function execute(message: Message) {
    if (message.author.bot) return;
    const foundUser = await find('user', { userID: message.author.id, guildID: message.guildId }) as userValue;
    //levelup(message, foundUser);

    if (foundUser && cooldown.has(message.author.id)) {
        update('user', { userID: foundUser.userID, guildID: message.guildId, xp: foundUser.xp, level: foundUser.level, messages: foundUser.messages + 1 });
        const expirationTime = cooldown.get(message.author.id) + (cooldownAmount * 1000);
        if (Date.now() < expirationTime) return;
    }

    cooldown.set(message.author.id, Date.now());
    setTimeout(() => cooldown.delete(message.author.id), (cooldownAmount * 1000));

    if (foundUser) {
        if (canLevelUp(foundUser)) {
            //levelup(message, foundUser);
        } else {
            update('user', { userID: foundUser.userID, guildID: message.guildId, xp: foundUser.xp + Math.floor(Math.random() * 20) + 10, level: foundUser.level, messages: foundUser.messages + 1 });
        }
    } else {
        add('user', { userID: message.author.id, guildID: message.guildId });
    }
}

function maxXP(user: userValue) {
    return Math.round((user.level * 1000) * (user.level * 1.35));
}

async function sort(type: optionsTypePlural, data: dataValues, guildOnly?: boolean) {
    if (type === 'users') {
        let usersArray = [];
        if (guildOnly) {
            let foundUsers = await users.findAll({ where: { guildID: data.guildID } });
            foundUsers.forEach(user => usersArray.push(user.dataValues));
            return usersArray.sort((a, b) => (Math.round((b.level * 1000) * (b.level * 1.35)) - Math.round((a.level * 1000) * (a.level * 1.35))));
        } else {
            let foundUsers = await users.findAll();
            foundUsers.forEach(user => usersArray.push(user.dataValues));
            return usersArray.sort((a, b) => (Math.round((b.level * 1000) * (b.level * 1.35)) - Math.round((a.level * 1000) * (a.level * 1.35))));
        }
    }
    if (type === 'cases' && data.guildID) {
        let casesArray = [];
        let foundCases = await cases.findAll({ where: { guildID: data.guildID } });
        foundCases.forEach(case_ => casesArray.push(case_.dataValues));
        return casesArray.sort((a, b) => (b.number - a.number));
    }
}

function sync() {
    //{ alter: true }
    users.sync();
    guilds.sync();
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

declare type optionsType = 'user' | 'guild' | 'case';
declare type optionsTypePlural = 'users' | 'guilds' | 'cases';

declare type userValue = {
    id?: number
    userID?: string
    guildID: string
    xp?: number
    level?: number
    messages?: number
    createdAt?: Date
    updatedAt?: Date
}

declare type guildValue = {
    id?: number
    guildID: string
    levelUpChannel?: string
    modLogChannel?: string
    userJoinChannel?: string
    userLeaveChannel?: string
    createdAt?: Date
    updatedAt?: Date
}

declare type caseValue = {
    id?: number
    guildID: string
    caseID?: string
    number?: number
    oldReason?: string
    updatedReason?: string
    type?: string
    createdAt?: Date
    updatedAt?: Date
}

declare type dataValues = userValue | guildValue | caseValue;

export { add, canLevelUp, caseValue, dataValues, execute, find, guildValue, maxXP, remove, sort, sync, update, userValue }
