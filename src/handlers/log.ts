export enum colors {
    reset = '\u001b[0m',
    black = '\u001b[30m',
    brightBlack = '\u001b[30;1m',
    red = '\u001b[31m',
    brightRed = '\u001b[31;1m',
    green = '\u001b[32m',
    brightGreen = '\u001b[32;1m',
    yellow = '\u001b[33m',
    brightYellow = '\u001b[33;1m',
    blue = '\u001b[34m',
    brightBlue = '\u001b[34;1m',
    purple = '\u001b[35m',
    brightPurple = '\u001b[35;1m',
    cyan = '\u001b[36m',
    brightCyan = '\u001b[36;1m',
    white = '\u001b[37m',
    brightWhite = '\u001b[37;1m'
}

export type logOptions = {
    bright?: boolean
}

const appName = 'Alexandrite';
const divider = ' > ';

export default class log {
    error(...data: any[]) {
        console.log(`${colors.red}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    log(...data: any[]) {
        console.log(`${colors.green}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    reset() {
        console.log(colors.reset);
    }
    black(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightBlack : colors.black}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    red(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightRed : colors.red}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    green(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightGreen : colors.green}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    yellow(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightYellow : colors.yellow}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    blue(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightBlue : colors.blue}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    purple(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightPurple : colors.purple}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    cyan(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightCyan : colors.cyan}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
    white(options: logOptions, ...data: any[]) {
        console.log(`${options.bright ? colors.brightWhite : colors.white}${appName}${colors.reset}${divider}${colors.cyan}${new Date(Date.now()).toLocaleString()}${colors.reset}${divider}${data ? `${data}` : ''}`);
    }
}
