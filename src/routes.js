import { Router } from 'express'

// Controllers
import usersController from './app/controllers/usersController'
import studentsController from './app/controllers/studentsController'
import sessionController from './app/controllers/sessionsController'

// Middlewares
import auth from './app/middlewares/auth'

const router = Router()

// Sessions
router.post('/sessions', sessionController.store)

/*
 ************************
 **** Secured routes ****
 ************************
 */
router.use(auth)

// Users
router.get('/users', usersController.index)
router.get('/users/:id', usersController.show)
router.post('/users', usersController.store)
router.put('/users/:id', usersController.update)
router.delete('/users/:id', usersController.destroy)

// Students
router.get('/students', studentsController.index)
router.get('/students/:id', studentsController.show)
router.post('/students', studentsController.store)
router.put('/students/:id', studentsController.update)
router.delete('/students/:id', studentsController.destroy)

export default router
