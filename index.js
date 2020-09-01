require('dotenv').config();
const api = require('./api');

(async () => {

    try {
        // purchase new domain
        // const godaddy = api.godaddy.run(domain);
        // console.log(godaddy);

        // create new website
        const createWebsite = await api.plesk.run(domain);
        console.log(createWebsite);

        // configure cloudflare
        const cloudflare = await api.cf.run(domain, ip);
        console.log(cloudflare);

    } catch (err) {
        console.log(err);
        console.log(err.response ? err.response.data : err.message);
    }
})();