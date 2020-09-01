const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4/zones',
    headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API}`
    },
});

const createZone = async domain => {

    try {
        const { data } = await instance.post('/', {
            name: domain,
            type: 'full'
        });
    
        return data.result.id;
    } catch (err) {
        return;
    }
};

const findZone = async domain => {

    const { data } = await instance.get(`/?name=${domain}`);

    if(!data.result.length) throw Error(`could not find domain: ${domain}`);

    return data.result[0].id;
};

const alwaysUseHTTPS = async zone => {

    await instance.patch(`/${zone}/settings/always_use_https`, {
        value: 'on'
    });

    return { success: true, message: 'Always use HTTPS applied' };
};

const findDNSRecord = async (zone, { type, name, content }, mx) => {

    const { data } = await instance.get(`/${zone}/dns_records?type=${type}&name=${name}${mx ? '&content=' + content.toLowerCase() : ''}`);

    if(!data.result.length) return;

    console.log(`${type} Record Found`);
    return data.result[0].id;
};

const updateDNSRecord = async (zone, dnsId, data) => {

    await instance.put(`/${zone}/dns_records/${dnsId}`, data);
    console.log(`${data.type} Record Updated`);
};

const createDNSRecord = async (zone, data) => {

    await instance.post(`/${zone}/dns_records`, data);
    console.log(`${data.type} Record Created`);
};

const setDNSRecord = async (zone, data, mx) => {

    // search dns record
    const dnsId = await findDNSRecord(zone, data, mx);

    // if exists then update, if no, create new
    dnsId ? await updateDNSRecord(zone, dnsId, data) : await createDNSRecord(zone, data);
};

const setAllRecords = async (zone, domain, ip) => {

    // set A Record
    await setDNSRecord(zone, {
        type: 'A',
        name: domain,
        content: ip,
        proxied: true
    });

    // set www CNAME record
    await setDNSRecord(zone, {
        type: 'CNAME',
        name: `www.${domain}`,
        content: domain,
        proxied: true
    });

    // set MX Records
    const MXRecords = [
        { content: 'ASPMX.L.GOOGLE.COM', priority: 1 },
        { content: 'ALT1.ASPMX.L.GOOGLE.COM', priority: 5 },
        { content: 'ALT2.ASPMX.L.GOOGLE.COM', priority: 5 },
        { content: 'ALT3.ASPMX.L.GOOGLE.COM', priority: 10 },
        { content: 'ALT4.ASPMX.L.GOOGLE.COM', priority: 10 },
    ];

    for(const item of MXRecords){
        await setDNSRecord(zone, {
            type: 'MX',
            name: domain,
            content: item.content,
            priority: item.priority,
            ttl: 3600,
        }, true);
    }

};

const run = async (domain, ip) => {

    const timeStart = Date.now();

    // creates zone
    const newZone = await createZone(domain);

    // check if zone created, if yes its assign the id, if no, it search the domain on the account
    const zone = newZone ? newZone : await findZone(domain);

    // sets Always use HTTPS
    await alwaysUseHTTPS(zone);

    // setup all Records
    await setAllRecords(zone, domain, ip);

    return { success: true, message: `Cloudflare finished successfully! took ${(Date.now() - timeStart) / 1000}s` };
};

module.exports = {
    run,
};