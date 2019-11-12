import { Router } from 'express'

// Controllers
import usersController from './app/controllers/usersController'
import studentsController from './app/controllers/studentsController'
import sessionController from './app/controllers/sessionsController'
import plansController from './app/controllers/plansController'
import registrationsController from './app/controllers/registrationsController'

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

// Plans
router.get('/plans', plansController.index)
router.get('/plans/:id', plansController.show)
router.post('/plans', plansController.store)
router.put('/plans/:id', plansController.update)
router.delete('/plans/:id', plansController.destroy)

// Registrations
router.get('/registrations', registrationsController.index)
router.post('/registrations', registrationsController.store)

export default router
