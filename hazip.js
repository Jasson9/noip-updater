'use strict'
const request = require('request')

function hazip() {
    return new Promise((Resolve, Reject) => {
        let ipv4, ipv6
        request.get('http://icanhazip.com', function (err, res, body) {
            if (err) {
                Reject(err)
            }
            try {
                ipv4 = new RegExp(/(.*.)\n/).exec(body)[1]
            } catch (error) {
                Reject(error)
            }
            request('http://ipv6.icanhazip.com', function (err, res, body) {
                if (err) {
                    Reject(err)
                }
                try {
                    ipv6 = new RegExp(/(.*.)\n/).exec(body)[1]
                } catch (error) {
                    Reject(error)
                }
                Resolve({
                    'ipv4': ipv4,
                    'ipv6': ipv6
                })
            })
        })
    })
}

module.exports = {
    hazip
}