const express = require('express')
const router = express.Router()
const {
  authenticate_User,
  authorize_Permissions,
} = require('../middleware/authentication')
const {
  get_All_Users,
  get_Single_User,
  show_Current_User,
  update_User,
  update_User_Password,
} = require('../Controllers/userController')

router
  .route('/')
  .get(authenticate_User, authorize_Permissions('admin'), get_All_Users)
router.route('/showMe').get(authenticate_User, show_Current_User)
router.route('/updateUser').patch(authenticate_User, update_User)
router
  .route('/updateUserPassword')
  .patch(authenticate_User, update_User_Password)
router.route('/:id').get(authenticate_User, get_Single_User)

module.exports = router
