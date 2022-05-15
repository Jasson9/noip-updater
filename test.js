const noip = require('./index');
const cookie = require('./cookie.json');

const myaccount = new noip.Account(cookie,true);

setInterval(() => {
    myaccount.update()
        .then(
            console.log('updated')
        )
        .catch(err => console.log(err))
}, 12000);

