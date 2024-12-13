const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('./customAPIerror')

class UnAuthorizedError extends CustomApiError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

module.exports = UnAuthorizedError
