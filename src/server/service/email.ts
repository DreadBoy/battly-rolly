import {send as mailSend, setApiKey} from '@sendgrid/mail';
import {MailDataRequired} from '@sendgrid/helpers/classes/mail';
import {User} from '../model/user';

if (!process.env.SENDGRID_API_KEY)
    throw new Error('Missing process.env.SENDGRID_API_KEY!');
if (!process.env.BASE_URL)
    throw new Error('Missing process.env.BASE_URL!');
setApiKey(process.env.SENDGRID_API_KEY);

function _config() {
    return {
        from: {
            email: 'no-reply@crithit.app',
            name: 'Crit Hit',
        },
        replyTo: {
            email: 'no-reply@crithit.app',
            name: 'Crit Hit',
        },
    };
}

export async function confirmEmail(email: string, key: string) {
    const config: MailDataRequired = {
        ..._config(),
        templateId: 'd-69d8b19b189a4b258fa9c5809a9f3320',
        personalizations: [
            {
                to: [
                    {
                        email,
                    },
                ],
                dynamicTemplateData: {
                    url: `${process.env.BASE_URL}/confirm?key=${key}`,
                },
            },
        ],
    };
    await mailSend(config);
}

export async function resetPassword(user: User) {
    const config: MailDataRequired = {
        ..._config(),
        templateId: 'd-a2e3298455d54da6b2f93938ceb2f23a',
        personalizations: [
            {
                to: [
                    {
                        email: user.email,
                    },
                ],
                dynamicTemplateData: {
                    url: `${process.env.BASE_URL}/app/reset-password?key=${user.resetPassword}`,
                    displayName: user.displayName,
                },
            },
        ],
    };
    await mailSend(config);
}
