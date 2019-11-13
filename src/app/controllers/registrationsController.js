import Registrations from '../models/Registrations'
import Student from '../models/Students'
import Plans from '../models/Plans'
import { parseISO, addMonths, isBefore, isAfter } from 'date-fns'
import Mail from '../../lib/Mail'
import * as Yup from 'yup'

import priceCalculate from '../../helpers/priceCalculate'
import formatToCurrency from '../../helpers/formatToCurrency'
import formatDate from '../../helpers/formatDate'

const index = async (req, res) => {
  const registrations = await Registrations.findAll({
    attributes: ['id', 'start_date', 'end_date', 'price'],
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['name', 'email'],
      },
      {
        model: Plans,
        as: 'plan',
        attributes: ['title', 'duration', 'price'],
      },
    ],
  })

  if (!registrations) {
    return res.status(400).json({ error: 'no registrations found' })
  }

  const data = registrations.map(
    // eslint-disable-next-line camelcase
    ({ id, price, start_date, end_date, student, plan }) => ({
      id,
      name: student.name,
      email: student.email,
      plan: {
        name: plan.title,
        duration: `${plan.duration} months`,
        price: `${formatToCurrency(plan.price)} per month`,
        startDate: formatDate(start_date),
        endDate: formatDate(end_date),
        totalPrice: `${formatToCurrency(price)}`,
      },
    })
  )

  return res.json(data)
}
const show = async (req, res) => {
  const { id } = req.params

  const registration = await Registrations.findByPk(id, {
    attributes: ['start_date', 'end_date', 'price'],
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['name', 'email'],
      },
      {
        model: Plans,
        as: 'plan',
        attributes: ['title', 'duration', 'price'],
      },
    ],
  })

  if (!registration) {
    return res.status(400).json({ error: 'Registration not found' })
  }

  // eslint-disable-next-line camelcase
  const { price, start_date, end_date, student, plan } = registration.toJSON()

  return res.json({
    id,
    name: student.name,
    email: student.email,
    plan: {
      name: plan.title,
      duration: `${plan.duration} months`,
      price: `${formatToCurrency(plan.price)} per month`,
      startDate: formatDate(start_date),
      endDate: formatDate(end_date),
      totalPrice: `${formatToCurrency(price)}`,
    },
  })
}
const store = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().required(),
    plan_id: Yup.number().required(),
    start_date: Yup.date().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations failed' })
  }

  // eslint-disable-next-line camelcase
  const { student_id, plan_id, start_date } = req.body

  const startPlanDate = parseISO(start_date)

  /*
    verify if date is past date
  */
  if (isBefore(startPlanDate, new Date())) {
    return res.status(400).json({ error: 'past date are not permited' })
  }

  /*
    verify if the student is already enrolled
  */
  const hasRegistration = await Registrations.findOne({
    where: { student_id },
  })

  if (hasRegistration) {
    return res.status(400).json({ error: 'the student already enrolled' })
  }

  /*
    verify if plan exists
  */
  const plan = await Plans.findByPk(plan_id)

  if (!plan) {
    return res.status(400).json({ error: 'Plan not exists' })
  }

  /*
    get student attributes
  */
  const student = await Student.findByPk(student_id, {
    attributes: ['name', 'email'],
  })

  if (!student) {
    return res.status(400).json({ error: 'Student not found' })
  }

  /*
    get plan attributes
  */
  const { title, duration, price } = plan
  const { name, email } = student

  const endPlanDate = addMonths(startPlanDate, duration)
  const planPrice = priceCalculate(price, duration)

  await Registrations.create({
    student_id,
    plan_id,
    start_date: startPlanDate,
    end_date: endPlanDate,
    price: planPrice,
  })

  // Send Mail to student

  await Mail({
    subject: `Olá ${name}`,
    to: `${name} <${email}>`,
    html: `
      <strong> Seja bem vindo a academia GymPoint </strong>
      <p>
        <smal>Segue abaixo os detalhes de seu plano:</smal>
      </p>
      <p>
        Plano: ${title}
      </p>
      <p>
        Duração: de ${formatDate(startPlanDate)} até ${formatDate(endPlanDate)}
      </p>
      <p>
        Valor: ${formatToCurrency(planPrice)}
      </p>
    `,
  }).send()

  return res.json({
    name,
    email,
    plan: title,
    duration,
    startDate: startPlanDate,
    endDate: endPlanDate,
    price: planPrice,
  })
}
const update = async (req, res) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().required(),
    plan_id: Yup.number().required(),
    start_date: Yup.date().required(),
  })

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations failed' })
  }

  return res.json({ message: 'update method' })
}
const destroy = async (req, res) => {
  const { id } = req.params

  const registration = await Registrations.findByPk(id)

  if (!registration) {
    res.status(400).json({ error: 'registration not found' })
  }

  /*
    check if registration is effective
  */

  // eslint-disable-next-line camelcase
  const { end_date } = registration

  if (isAfter(end_date, new Date())) {
    return res.status(400).json({
      error:
        'The plan is active and has not yet expired. Deleting existing plans is not allowed',
    })
  }

  await registration.destroy()

  return res.json({ message: 'registration removed' })
}

export default { index, show, store, update, destroy }
