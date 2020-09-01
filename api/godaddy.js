const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.godaddy.com/v1',
    headers: {
        Authorization: `sso-key ${process.env.GODADDY_API}`
    }
});

const checkAvailable = async domain => {

    const { data } = await instance.get(`/domains/available?domain=${domain}`);

    if(!data.available) throw Error(`domain is not available [${domain}]`);

    // check if price is lower than 20
    const price = data.price / 1000000;
    if(price > 20) throw Error(`price is too high for ${domain}`);

    return data;
};

const purchaseDomain = async domain => {

    const { data } = await instance.post('/domains/purchase', {
        consent: {
            agreedAt: new Date().toISOString(),
            agreedBy: 'Erin',
            agreementKeys: [
                'DNRA',
                'DNPA'
            ]
        },
        contactAdmin: {
            addressMailing: {
                address1: '4117 Sweetwood Drive',
                address2: '',
                city: 'Boulder',
                country: 'US',
                postalCode: '80302',
                state: 'CO'
            },
            email: 'example@domain.com',
            fax: '',
            jobTitle: '',
            nameFirst: 'Erin',
            nameLast: 'Maxwell',
            nameMiddle: '',
            organization: 'Buttrey Food',
            phone: '+1.3034133580'
        },
        contactBilling: {
            addressMailing: {
                address1: '4117 Sweetwood Drive',
                address2: '',
                city: 'Boulder',
                country: 'US',
                postalCode: '80302',
                state: 'CO'
            },
            email: 'example@domain.com',
            fax: '',
            jobTitle: '',
            nameFirst: 'Erin',
            nameLast: 'Maxwell',
            nameMiddle: '',
            organization: 'Buttrey Food',
            phone: '+1.3034133580'
        },
        contactRegistrant: {
            addressMailing: {
                address1: '4117 Sweetwood Drive',
                address2: '',
                city: 'Boulder',
                country: 'US',
                postalCode: '80302',
                state: 'CO'
            },
            email: 'example@domain.com',
            fax: '',
            jobTitle: '',
            nameFirst: 'Erin',
            nameLast: 'Maxwell',
            nameMiddle: '',
            organization: 'Buttrey Food',
            phone: '+1.3034133580'
        },
        contactTech: {
            addressMailing: {
                address1: '4117 Sweetwood Drive',
                address2: '',
                city: 'Boulder',
                country: 'US',
                postalCode: '80302',
                state: 'CO'
            },
            email: 'example@domain.com',
            fax: '',
            jobTitle: '',
            nameFirst: 'Erin',
            nameLast: 'Maxwell',
            nameMiddle: '',
            organization: 'Buttrey Food',
            phone: '+1.3034133580'
        },
        domain,
        nameServers: [
            'walk.ns.cloudflare.com',
            'wilson.ns.cloudflare.com'
        ],
        period: 1,
        privacy: true,
        renewAuto: true
    });

    return data;
};

const run = async domain => {

    // check domain availability
    await checkAvailable(domain);

    // purchase domain
    const response = await purchaseDomain(domain);

    return { success: true, message: `${domain} purchased successfully!`, response };
};

module.exports = {
    run,
};