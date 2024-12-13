const User = require('../Models/User')

const Token = require('../Models/Token')

const { StatusCodes } = require('http-status-codes')

const CustomError = require('../Errors')

const crypto = require('crypto')

const {
  createTokenUser,
  create_Token_and_cookie_and_send,
  create_Hash,
} = require('../Utils')

// Controller function starts from here
const register = async (req, res) => {
  const { name, email, password } = req.body

  const isThisEmailTaken = await User.findOne({ email })

  if (isThisEmailTaken) {
    throw new CustomError.BadRequestError(
      `This email already exists. Seems like you have already registered with us. If you haven't registered with us, try some other email address.Or please visit the Login page and login`
    )
  }

  // Setting the role for first user as admin and others as users
  const isThisFirstAccount = (await User.countDocuments({})) === 0

  const role = isThisFirstAccount ? 'admin' : 'user'

  const user = await User.create({ name, email, password, role })

  const tokenUser = createTokenUser(user)

  // create_Token_and_cookie_and_send(res, tokenUser)

  res.status(StatusCodes.CREATED).json({
    msg: `You have successfully registered with us! Thank You!`,
    user: tokenUser,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Your email or password is missing. Please enter both your email address and password to login'
    )
  }

  const doesUserExist = await User.findOne({ email })

  if (!doesUserExist) {
    throw new CustomError.UnAuthenticatedError(
      'Your email address or password is incorrect. Please enter your correct email address and password'
    )
  }

  const isPasswordCorrect = await doesUserExist.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new CustomError.UnAuthenticatedError(
      'The password you entered is wrong. Please enter the correct password'
    )
  }

  const tokenUser = createTokenUser(doesUserExist)
  // creating refresh token
  let refreshToken = ''
  // checking for refresh token
  const existing_Token = await Token.findOne({ user: doesUserExist._id })
  if (existing_Token) {
    const { isValid } = existing_Token
    if (!isValid) {
      throw new CustomError.UnAuthenticatedError('Invalid Credentials')
    }
    refreshToken = existing_Token.refreshToken
    create_Token_and_cookie_and_send({ res, tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
    return
  }
  // if there is no token then we are creating one
  refreshToken = crypto.randomBytes(40).toString('hex')
  const ip = req.ip
  const userAgent = req.headers['user-agent']

  const user_Token = { refreshToken, ip, userAgent, user: doesUserExist._id }

  await Token.create(user_Token)

  create_Token_and_cookie_and_send({ res, tokenUser, refreshToken })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  res.cookie('access_token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.cookie('refresh_token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(StatusCodes.OK).send('You have successfully logged out')
}

const forgot_Password = async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new CustomError.BadRequestError('Please provide your email address')
  }

  const user = await User.findOne({ email })

  const password_Token = crypto.randomBytes(40).toString('hex')

  // const ten_Minutes = 1000 * 60 * 10

  // const password_Expiration_Date = new Date(Date.now() + ten_Minutes) // 10 minutes

  // send reset password link through email
  // await send_Reset_Password_Email({
  //   name: user.name,
  //   email: user.email,
  //   token: password_Token,
  //   origin,
  // })
  user.passwordToken = create_Hash(password_Token)
  // user.passwordExpirationDate = password_Expiration_Date
  await user.save()

  const origin = 'http://localhost:3000'
  const reset_Password_URL = `${origin}/user/reset-password?token=${password_Token}&email=${email}`
  res.status(StatusCodes.OK).send(`${reset_Password_URL}`)
}

const reset_Password = async (req, res) => {
  const { token, email, password } = req.body

  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Please enter the new password')
  }

  const user = await User.findOne({ email })
  if (user) {
    // const current_Time = new Date()
    // if (
    //   user.passwordToken === create_Hash(token) &&
    //   user.passwordExpirationDate > current_Time
    // )
    if (user.passwordToken === create_Hash(token)) {
      user.password = password
      user.passwordToken = null
      // user.passwordExpirationDate = null
      await user.save()
    }
  }

  res.status(StatusCodes.OK).json({
    msg: `Success! Your password has been reset.`,
  })
}

module.exports = {
  register,
  login,
  logout,
  forgot_Password,
  reset_Password,
}
