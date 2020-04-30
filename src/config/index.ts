export const app = {
    secret: 'jwwwwt', // jwt私钥
    exp: '1h'  // Eg: 60, "2 days", "10h", "7d" // jwt有效时间
}

/**
 * logger config
 */
export const log4js = {
    appenders: {
        out: {
            type: 'stdout',
            layout: { type: 'basic' }
        },
        file: {
            type: 'file',
            filename: 'logs/system.log',
            maxLogSize: 10485760,
            backups: 3,
            compress: true,
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy/MM/dd:hh.mm.ss}] %p %c - %m%n'
            }
        }
    },
    categories: { default: { appenders: ['file'], level: 'info' } }
};
