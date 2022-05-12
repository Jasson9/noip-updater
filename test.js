const noip = require('./index');
const cookie = require('./cookie.json');

const myaccount = new noip.Account(cookie)
setInterval(() => {
    myaccount.update()
        .then(
            console.log('updated')
        )
        .catch(err => console.log(err))
    //console.log(myaccount.cookie)
}, 120000);
