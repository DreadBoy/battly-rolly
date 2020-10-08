export const logger = {
    info(...args: any[]) {
        console.log(...args);
    },
    error(...args: any[]) {
        if (args[0] instanceof Error) {
            console.error(`${
                args[0].message
            }, stack: ${
                (args[0].stack ?? '').replace('\n', ' | ')
            }`);
            return;
        }
        console.error(...args);
    },
}
