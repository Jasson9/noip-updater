var cheeerio = require('cheerio');
var fetch = require('node-fetch').default;
var { cookieparser } = require('./cookieparser');

function getToken() {    //get X-Csrf-Token for request headers
    return new Promise((Resolve, Reject) => {
        fetch('https://my.noip.com/dynamic-dns', {
            headers: {
                "accept": "application/json, text/plain, */*",
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookieparser(this.cookie)
            },
            method: 'GET'
        })
            .then(res => res.text())
            .then(data => {
                let $ = cheeerio.load(data);
                Resolve($('#token').get()[0].attribs.content);
            })
            .catch(err => Reject(err))
    })
}

module.exports = {
    getToken
}