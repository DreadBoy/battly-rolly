export const logger = {
    info(...args: any[]) {
        if (process.env.LOG_LEVEL === 'info')
            console.log(...args);
    },
    error(...args: any[]) {
        console.error(...args);
    },
}
