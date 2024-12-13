const User = require('../Models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../Errors')
const {
  createTokenUser,

  create_Token_and_cookie_and_send,
  check_Permissions,
} = require('../Utils')

const get_All_Users = async (req, res) => {
  //   console.log(req.user)
  const get_All_Users = await User.find({ role: 'user' }).select(['-password'])
  res.status(StatusCodes.OK).json({ data: get_All_Users })
}

const get_Single_User = async (req, res) => {
  const get_Single_User = await User.findOne({ _id: req.params.id }).select([
    '-password',
  ])

  if (!get_Single_User) {
    throw new CustomError.NotFoundError(
      `There is no user with this id:${req.params.id}`
    )
  }

  check_Permissions(req.user, get_Single_User._id)

  res.status(StatusCodes.OK).json({ data: get_Single_User })
}

const show_Current_User = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const update_User = async (req, res) => {
  const { email, name } = req.body

  if (!email || !name) {
    throw new CustomError.BadRequestError(
      'Please enter either the email or name or both name and email if you need to update'
    )
  }
  // const user = await User.findOneAndUpdate(
  //   { _id: req.user.userId },
  //   { email, name },
  //   { new: true, runValidators: true }
  // )

  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.firstName = name

  await user.save()

  const tokenUser = createTokenUser(user)
  // const token = createJWT(tokenUser)
  // const One_Day = 1000 * 60 * 60 * 24
  // res.cookie('token', token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + One_Day),
  //   secure: process.env.NODE_ENV === 'production',
  //   signed: true,
  // })
  create_Token_and_cookie_and_send(res, tokenUser)
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const update_User_Password = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please enter both the old and new password.'
    )
  }

  const user = await User.findOne({ _id: req.user.userId })

  const is_Old_Password_Correct = await user.comparePassword(oldPassword)

  if (!is_Old_Password_Correct) {
    throw new CustomError.UnAuthenticatedError(
      'The old password you entered is wrong. Please check and enter the right old Password'
    )
  }

  user.password = newPassword
  await user.save()

  res
    .status(StatusCodes.OK)
    .json({ message: 'Your new password has been updated successfully.' })
}

module.exports = {
  get_All_Users,
  get_Single_User,
  show_Current_User,
  update_User,
  update_User_Password,
}
