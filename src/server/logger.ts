import {createLogger, transports, format} from 'winston';

export const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf((info) => {
                    return info.message;
                }),
            ),
        }),
    ],
});
