const CustomError = require('../Errors')

const check_Permissions = (requestUser, resourceUserId) => {
  if (requestUser.userRole === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return
  throw new CustomError.UnAuthorizedError(
    'You are not authorized to access this route'
  )
}

module.exports = check_Permissions
