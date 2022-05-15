const fetch = require('node-fetch').default;
const { cookieparser } = require('./cookieparser');
const fs = require('fs')

function updatecookie(cookie) {
    var newcookie = []
    var xsrfregex = new RegExp(/XSRF-TOKEN=(.*?);/);
    var lararegex = new RegExp(/laravel_session=(.*?);/);
    return new Promise((Resolve, Reject) => {
        fetch("https://my.noip.com/api/account/preferences", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookieparser(cookie)
            },
            "body": null,
            "method": "GET"
        }
        ).then(res => {
            var cookie = res.headers.get('set-cookie');
            newcookie.push({ "name": 'XSRF-TOKEN', 'value': xsrfregex.exec(cookie)[1] });
            newcookie.push({ "name": 'laravel_session', 'value': lararegex.exec(cookie)[1] })
            fs.writeFileSync('cookie.json', JSON.stringify(newcookie));
            Resolve(newcookie);
        })
            .catch(err => Reject(err))
    })
}

module.exports = {
    updatecookie
}