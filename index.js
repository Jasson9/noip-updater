const fetch = require('node-fetch').default;
const { hazip } = require('./lib/hazip');
const { cookieparser } = require('./lib/cookieparser');
const { updatecookie } = require('./lib/updatecookie');
const {getToken} = require('./lib/getToken')
/**
* @typedef {data} data
* @callback cb
* @param {res}
*/
/**
 * @typedef {Object} returnget
 * @property {Object} hosts
 * @property {Number} host_count
 * @property {Number} host_limit
 * @property {String} hosts.hours_remaining
 * @property {String} hosts.days_remaining
 * @property {String} hosts.days_until_confirmation
 * @property {String} hosts.days_until_redemption
 * @property {String} hosts.renew_url
 * @property {String} hosts.renew_url
 * @property {String} hosts.ipv6
 * @property {String} hosts.target
 * @property {{hosts:Object}[]}
 */

class Account {
    /**
     * Initiate account class
     * @param {object[]} cookie 
     * @param {boolean} autoupdatecookie  update cookies every 30 minutes
     */
    constructor(cookie, autoupdatecookie) {
        this.cookie = cookie
        if (autoupdatecookie == undefined) {
            this.autoupdatecookie = true
        } else {
            this.autoupdatecookie = autoupdatecookie
        }
        if (this.autoupdatecookie == true) {
            setInterval(() => {
                updatecookie(this.cookie)
                .then(res => {
                    this.cookie = res;
                })
            }, 600000);//1800000
        }
    }
    /**
     * @param {object[]} options
     * @param {String} options.ipv4 Specify IPv4 Address
     * @param {String} options.ipv6 Specify IPv6 Address
     * @param {String} hostname hostname target, leave it blank will apply ip to all hostnames
     * if leaved blank it will use icanhazip to get IP address
     */
    async update(options = {
        'ipv4': false, 'ipv6': false, 'enable': true
    }, hostname) {
        if (!options.ipv4 || !options.ipv6) {
            var ip = await hazip();
            if (!options.ipv4) options.ipv4 = ip['ipv4'];
            if (!options.ipv6) options.ipv6 = ip['ipv6'];
        }
        var hosts = (await this.get()).hosts;
        var token = (await getToken(this.cookie));
        for (var i = 0; i < hosts.length; i++) {
            try {
                if (hostname) {
                    if (hostname == hosts[i].hostname) { //execute to specified hostname
                        hosts[i].target = options.ipv4;
                        hosts[i].ipv6 = options.ipv6;
                        hosts[i].enable = options.enable;
                        await this.put(hosts[i].id, token, hosts[i]);
                    }
                } else {  //execute to all hostname
                    hosts[i].target = options.ipv4;
                    hosts[i].ipv6 = options.ipv6;
                    hosts[i].enable = options.enable;
                    await this.put(hosts[i].id, token, hosts[i]);
                }
            } catch (error) {
                throw error
            }
        }
    }

    /**
     * @returns {Promise<returnget:Object>}
     * @param {returnget}
     */
    async get() {   //get hostnames
        var body = await fetch("https://my.noip.com/api/host", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookieparser(this.cookie),
            },
            "body": null,
            "method": "GET"
        }).then(res => res.text())
        .then(body => {
            if(body == 'Unauthorized.') {
                throw 'Unauthorized';
            } else {
                return JSON.parse(body);
            }
        })
            .catch(err=>{throw err})
        return body
    }

    put(id, token, payload) {  //change hostname setting
        return new Promise((Resolve, Reject) => {
            fetch(`https://my.noip.com/api/host/${id}`, {
                "headers": {
                    'Content-Length': JSON.stringify(payload).length,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'cookie': cookieparser(this.cookie),
                    'Connection': 'close'
                },
                "body": JSON.stringify(payload),
                "method": "PUT"
            }).then(res => res.text())
                .then(body => {
                    if (body == 'Unauthorized') {
                        Reject('Unauthorized');
                    } else {
                        Resolve(JSON.parse(body));
                    }
                }).catch(err => Reject(err));
        })
    }

}

module.exports = { Account }