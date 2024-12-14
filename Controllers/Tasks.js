const { StatusCodes } = require('http-status-codes')
const Tasks = require('../Models/Tasks')
const CustomError = require('../Errors')

const { check_Permissions } = require('../Utils')

const create_Tasks = async (req, res) => {
  req.body.user = req.user.userId
  if (!req.body) {
    throw new CustomError.BadRequestError('Please enter a task.')
  }

  const tasks = await Tasks.create(req.body)

  res.status(StatusCodes.OK).json({ tasks })
}

const get_All_Tasks = async (req, res) => {
  const all_Tasks = await Tasks.find({ user: req.user.userId })

  res.status(StatusCodes.OK).json({ tasks: all_Tasks })
}

const get_Single_Task = async (req, res) => {
  const { id: taskID } = req.params

  if (!taskID) {
    throw new CustomError.NotFoundError(
      `There is no such task with such id:${taskID}`
    )
  }

  const single_Task = await Tasks.findOne({ _id: taskID })

  check_Permissions(req.user, single_Task.user)

  res.status(StatusCodes.OK).json({ task: single_Task })
}

const edit_or_Update_the_Task = async (req, res) => {
  const taskId = req.params.id

  if (!taskId) {
    throw new CustomError.NotFoundError(
      `There is no such task exists with this id:${taskId}`
    )
  }

  const task = await Tasks.findOne({ _id: taskId })

  check_Permissions(req.user, task.user)

  const updated_Task = await Tasks.findByIdAndUpdate(
    { _id: taskId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  res.status(StatusCodes.OK).json({
    msg: 'Your task has been updated successfully',
    tasks: updated_Task,
  })
}

const delete_the_Task = async (req, res) => {
  const taskId = req.params.id

  const task = await Tasks.findOne({ _id: taskId })

  if (!task) {
    throw new CustomError.NotFoundError(
      `There is no such task exists with this id:${taskId}`
    )
  }

  check_Permissions(req.user, task.user)

  const delete_Task = await Tasks.findOneAndDelete({ _id: taskId })

  res
    .status(StatusCodes.OK)
    .json({ msg: 'task deleted successfully', delete_Task })
}

module.exports = {
  create_Tasks,
  get_All_Tasks,
  get_Single_Task,
  edit_or_Update_the_Task,
  delete_the_Task,
}
