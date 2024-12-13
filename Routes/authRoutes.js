const express = require('express')

const router = express.Router()
const { authenticate_User } = require('../middleware/authentication')
const {
  register,
  login,
  logout,
  forgot_Password,
  reset_Password,
} = require('../Controllers/authController')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').delete(authenticate_User, logout)
router.route('/forgot-password').post(forgot_Password)
router.route('/reset-password').post(reset_Password)

module.exports = router
