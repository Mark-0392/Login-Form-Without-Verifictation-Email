const jwt = require('jsonwebtoken')
const { create } = require('../Models/User')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_Secret_Key)
  return token
}

const is_Token_Valid = (token) => jwt.verify(token, process.env.JWT_Secret_Key)

const create_Token_and_cookie_and_send = ({ res, tokenUser, refreshToken }) => {
  const access_TokenJWT = createJWT({ payload: { tokenUser } })
  const refresh_TokenJWT = createJWT({ payload: { tokenUser, refreshToken } })

  const twelve_hours = 1000 * 60 * 60 * 12
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('access_token', access_TokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + twelve_hours),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
  res.cookie('refresh_token', refresh_TokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = { createJWT, is_Token_Valid, create_Token_and_cookie_and_send }
