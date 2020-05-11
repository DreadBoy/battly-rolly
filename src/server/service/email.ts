import {SMTPServer} from 'smtp-server';
import {setApiKey, send as mailSend} from '@sendgrid/mail';


if (!process.env.SENDGRID_API_KEY)
    throw new Error('Missing process.env.SENDGRID_API_KEY!');
setApiKey(process.env.SENDGRID_API_KEY);

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
    const msg = {
        to: 'test@example.com',
        from: 'test@example.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    await mailSend(msg);
}
