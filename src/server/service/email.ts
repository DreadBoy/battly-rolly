import {SMTPServer} from 'smtp-server';
import Sendmail from 'sendmail';

if (process.env.NODE_ENV === 'development') {
    // This is local SMTP server we use to test. We can't send emails from localhost to actual email addresses
    // So we set up local SMTP server and send email to it
    const server = new SMTPServer({
        secure: false,
        authOptional: true,
        onConnect(session, callback) {
            if (session.remoteAddress !== '127.0.0.1') {
                return callback(new Error('No connections from outside allowed'));
            }
            return callback();
        },
        onData(stream, session, callback) {
            stream.pipe(process.stdout);
            stream.on('end', callback);
        },
    });
    server.listen(587);
    server.on('error', err => {
        console.log('Error %s', err.message);
    });
}

export async function send() {
    const sendmail = process.env.NODE_ENV === 'development' ?
        Sendmail({
            devHost: 'localhost',
            devPort: 587,
        }) :
        Sendmail({});

    await new Promise((resolve, reject) => {
        sendmail({
            from: 'no-reply@battly-rolly.herokuapp.com',
            to: 'vertical3life@gmail.com',
            subject: 'test sendmail',
            html: 'Mail of test sendmail ',
        }, function (err, reply) {
            if (err)
                return reject(err);
            resolve(reply);
        })
    })
}
