const express = require('express')

const router = express.Router()

const { authenticate_User } = require('../middleware/authentication')

const {
  create_Tasks,
  get_All_Tasks,
  get_Single_Task,
  edit_or_Update_the_Task,
  delete_the_Task,
} = require('../Controllers/Tasks')

router
  .route('/')
  .get(authenticate_User, get_All_Tasks)
  .post(authenticate_User, create_Tasks)
router
  .route('/:id')
  .get(authenticate_User, get_Single_Task)
  .patch(authenticate_User, edit_or_Update_the_Task)
  .delete(authenticate_User, delete_the_Task)

module.exports = router
