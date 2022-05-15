function cookieparser(cookie) {
    var final = [];
    for (var i = 0; i < cookie.length; i++) {
        final.push(`${cookie[i]['name']}=${cookie[i]['value']}; `)
    }
    return final.join('')
}

module.exports = {
    cookieparser
}