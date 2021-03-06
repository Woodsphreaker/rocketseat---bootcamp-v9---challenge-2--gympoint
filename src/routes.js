import { Router } from 'express'

// Controllers
import usersController from './app/controllers/usersController'
import studentsController from './app/controllers/studentsController'
import sessionController from './app/controllers/sessionsController'
import plansController from './app/controllers/plansController'
import registrationsController from './app/controllers/registrationsController'
import ckeckinsController from './app/controllers/checkinsController'
import helpOrdersController from './app/controllers/helpOrdersController'
import answersController from './app/controllers/answersController'

// Middlewares
import auth from './app/middlewares/auth'

const router = Router()

// Sessions
router.post('/sessions', sessionController.store)

// Checkins
router.get('/students/:id/checkins', ckeckinsController.index)
router.post('/students/:id/checkins', ckeckinsController.store)

// Help Orders
router.get('/students/:id/help-orders', helpOrdersController.index)
router.post('/students/:id/help-orders', helpOrdersController.store)

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
router.get('/registrations/:id', registrationsController.show)
router.post('/registrations', registrationsController.store)
router.put('/registrations/:id', registrationsController.update)
router.delete('/registrations/:id', registrationsController.destroy)

// Answers
router.get('/help-orders', answersController.index)
router.post('/help-orders/:id/answer', answersController.store)

export default router
