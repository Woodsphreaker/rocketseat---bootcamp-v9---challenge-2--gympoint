import { Router } from 'express'
import usersController from './app/controllers/usersController'
import studentsController from './app/controllers/studentsController'

const router = Router()

// Users
router.get('/users', usersController.index)

// Students
router.get('/students', studentsController.index)
router.get('/students/:id', studentsController.show)
router.post('students', studentsController.store)
router.put('/students/:id', studentsController.update)
router.delete('/students/:id', studentsController.destroy)

export default router
