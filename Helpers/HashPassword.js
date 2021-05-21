const crypto = require('crypto')

function HashPassword(password){
    const hmac = crypto.createHmac('sha256', 'abc123')
    hmac.update(password)
    var passwordHashed = hmac.digest('hex')

    return passwordHashed
}

module.exports = HashPassword