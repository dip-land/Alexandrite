function toHMS(number: string | number, showFull?: boolean) {
    number = `${number}`;
    let secondsNumber = parseInt(number, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - (hours / 3600)) / 60);
    let seconds = secondsNumber - (hours * 3600) - (minutes * 60);

    if (showFull) {
        if (hours === 0 && minutes === 0) {
            return `${seconds} second(s)`;
        } else if (hours === 0) {
            return `${minutes} minute(s) and ${seconds} second(s)`;
        } else {
            return `${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`
        }
    } else {
        if (hours === 0 && minutes === 0) {
            return `${seconds} second(s)`;
        } else if (hours === 0) {
            return `${minutes} minute(s)`;
        } else {
            return `${hours} hour(s)`;
        }
    }
}

export { toHMS }
