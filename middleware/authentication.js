const CustomError = require('../Errors')
const Token = require('../Models/Token')
const { is_Token_Valid, create_Token_and_cookie_and_send } = require('../Utils')

const authenticate_User = async (req, res, next) => {
  const { access_token, refresh_token } = req.signedCookies

  try {
    if (access_token) {
      const payload = is_Token_Valid(access_token)
      req.user = payload.tokenUser
      return next()
    }

    const payload = is_Token_Valid(refresh_token)

    const existing_Token = await Token.findOne({
      user: payload.tokenUser.userId,
      refreshToken: payload.refreshToken,
    })

    if (!existing_Token || !existing_Token?.isValid) {
      throw new CustomError.UnAuthenticatedError('Authentication Failed')
    }
    create_Token_and_cookie_and_send({
      res,
      tokenUser: payload.tokenUser,
      refreshToken: existing_Token.refreshToken,
    })
    req.user = payload.tokenUser
    next()
  } catch (error) {
    throw new CustomError.UnAuthenticatedError('Authentication Invalid')
  }
}

const authorize_Permissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      throw new CustomError.UnAuthorizedError(
        'You are not authorized to access this route'
      )
    }
    next()
  }
}

module.exports = { authenticate_User, authorize_Permissions }
