
const generator = require('generate-password');

const ftpPw = () => {
    const password = generator.generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        strict: true,
    });

    return password + '%#';
};

const rndNumbers = (length = 4) => generator.generate({
    length,
    numbers: true,
    lowercase: false,
    uppercase: false,
});

const ftpUsr = (domain = 'example.com') => {

    const split = domain.split('.');

    if(split.length === 2) return `${split[0]}-${rndNumbers()}`;

    split.pop(); // remove last item
    const str = split.join('.');
    return `${str}-${rndNumbers()}`;
};

module.exports = {
    ftpPw,
    rndNumbers,
    ftpUsr,
};