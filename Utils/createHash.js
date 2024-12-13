const crypto = require('crypto')

const create_Hash = (password_Token) =>
  crypto.createHash('md5').update(password_Token).digest('hex')

module.exports = create_Hash
