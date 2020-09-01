const axios = require('axios');
const funcs = require('../funcs');

const instance = axios.create({
    baseURL: 'https://manage.education-sites.com:8443/api/v2',
    headers: {
        'x-api-key': process.env.PLESK_API
    }
});

const createDomain = async domain => {

    const { data } = await instance.post('/domains', {
        name: domain,
        hosting_type: 'virtual',
        hosting_settings: {
            ftp_login: funcs.ftpUsr(domain),
            ftp_password: funcs.ftpPw(),
        }
    });
    return data;
};

const installWordpress = async domain => {

    return await instance.post('/cli/extension/call', {
        params: [
            '--call',
            'wp-toolkit',
            '--install',
            '-domain-name',
            `${domain}`,
            '-path',
            '/',
            '-set-id',
            '8',
            '-admin-email',
            'asaf@vvl.email'
        ]
    });
};

const run = async domain => {

    // create domain
    await createDomain(domain);

    // install wordpress
    await installWordpress(domain);
    
    return { success: true, message: `Wordpress installed successfully on ${domain}` };    
};

module.exports = {
    run,
};